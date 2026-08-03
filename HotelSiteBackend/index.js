require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const { fromFile } = require('file-type')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const authMiddleware = require('./middleware/authMiddleware')
const checkRole = require('./middleware/checkRoleMiddleware')

const PORT = process.env.PORT || 5001

const app = express()
app.disable('x-powered-by')
// Public requests reach Express through Caddy and nginx. Trust only those two
// internal hops so rate limiting uses the client address from X-Forwarded-For,
// rather than treating every visitor as the proxy container.
app.set('trust proxy', 2)
// The public HTML is served by nginx/Caddy, while this process serves the API
// and media. Keep media embeddable from the same public origin, but apply the
// remaining Helmet protections to every API response.
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))
const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(cors(allowedOrigins?.length ? { origin: allowedOrigins } : { origin: process.env.NODE_ENV !== 'production' }))

// Login is deliberately throttled separately from the rest of the API: bcrypt
// is expensive by design, so unrestricted attempts can become both a password
// guessing vector and a CPU-exhaustion vector.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Слишком много попыток входа. Повторите через 15 минут.' }
})
app.use('/api/user/login', loginLimiter)
// JSON в API не содержит медиа: файлы принимаются отдельным защищённым endpoint.
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
// Normalize duplicate slashes to avoid //static/... 404s
app.use((req, _res, next) => {
  if (typeof req.url === 'string' && req.url.includes('//')) {
    req.url = req.url.replace(/\/+/, '/').replace(/\/+/, '/');
    // Collapse any remaining multiple slashes
    while (req.url.includes('//')) req.url = req.url.replace(/\/+/, '/');
  }
  next()
})

// Статика доступна только по явному префиксу; это исключает двойную обработку
// каждого файла и не смешивает API с файловой системой.
app.use('/static', express.static(path.resolve(__dirname, 'static'), {
  setHeaders: (res, filePath) => {
    // Явно устанавливаем MIME-типы для видео файлов
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    } else if (filePath.endsWith('.webm')) {
      res.setHeader('Content-Type', 'video/webm');
    } else if (filePath.endsWith('.avi')) {
      res.setHeader('Content-Type', 'video/x-msvideo');
    } else if (filePath.endsWith('.mov')) {
      res.setHeader('Content-Type', 'video/quicktime');
    } else if (filePath.endsWith('.wmv')) {
      res.setHeader('Content-Type', 'video/x-ms-wmv');
    } else if (filePath.endsWith('.flv')) {
      res.setHeader('Content-Type', 'video/x-flv');
    } else if (filePath.endsWith('.mkv')) {
      res.setHeader('Content-Type', 'video/x-matroska');
    }
    // Accept-Ranges для поддержки перемотки видео
    res.setHeader('Accept-Ranges', 'bytes');
  }
}))
// ✅ Увеличиваем лимит для загрузки файлов до 100MB
app.use(fileUpload({
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  abortOnLimit: true,
  responseOnLimit: 'Размер файла превышает допустимый лимит.',
  useTempFiles: true,
  tempFileDir: '/tmp/'
}))

const uploadPolicies = {
  dishes: { extensions: new Set(['.jpg', '.jpeg', '.png', '.webp']), mimeTypes: new Set(['image/jpeg', 'image/png', 'image/webp']), maxBytes: 10 * 1024 * 1024 },
  wines: { extensions: new Set(['.jpg', '.jpeg', '.png', '.webp']), mimeTypes: new Set(['image/jpeg', 'image/png', 'image/webp']), maxBytes: 10 * 1024 * 1024 },
  rooms: { extensions: new Set(['.jpg', '.jpeg', '.png', '.webp']), mimeTypes: new Set(['image/jpeg', 'image/png', 'image/webp']), maxBytes: 10 * 1024 * 1024 },
  pages: { extensions: new Set(['.jpg', '.jpeg', '.png', '.webp']), mimeTypes: new Set(['image/jpeg', 'image/png', 'image/webp']), maxBytes: 10 * 1024 * 1024 },
  videos: { extensions: new Set(['.mp4', '.webm']), mimeTypes: new Set(['video/mp4', 'video/webm']), maxBytes: 100 * 1024 * 1024 }
};

// Media changes are admin-only.  The endpoint accepts a deliberately small
// format allowlist; file names, MIME type and target directory are never taken
// from the client unchecked.
app.post('/api/upload', authMiddleware, checkRole('ADMIN'), async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFile = req.files.file;
    if (!uploadedFile || Array.isArray(uploadedFile)) {
      return res.status(400).json({ message: 'File field is required' });
    }
    if (uploadedFile.truncated) {
      return res.status(413).json({ message: 'File is too large' });
    }

    const mediaType = req.body.type || req.query.type;
    const policy = uploadPolicies[mediaType];
    if (!policy) {
      return res.status(400).json({ message: 'Invalid media type' });
    }

    const fileExtension = path.extname(uploadedFile.name).toLowerCase();
    if (!policy.extensions.has(fileExtension) || !policy.mimeTypes.has(uploadedFile.mimetype)) {
      return res.status(415).json({ message: 'Unsupported media format' });
    }
    if (uploadedFile.size > policy.maxBytes) {
      return res.status(413).json({ message: 'File is too large for this media type' });
    }

    // Do not trust the MIME type sent by the browser.  Identify the bytes in
    // the temporary file before it is moved into public static storage.
    const detectedType = await fromFile(uploadedFile.tempFilePath);
    if (!detectedType || !policy.mimeTypes.has(detectedType.mime)) {
      return res.status(415).json({ message: 'File contents do not match an allowed media format' });
    }

    const fileName = `${crypto.randomUUID()}${fileExtension}`;
    const uploadDirectory = path.resolve(__dirname, 'static', mediaType);
    const uploadPath = path.join(uploadDirectory, fileName);
    await fs.promises.mkdir(uploadDirectory, { recursive: true });

    await uploadedFile.mv(uploadPath);

    res.status(201).json({
      url: `/static/${mediaType}/${fileName}`,
      fileName,
      size: uploadedFile.size,
      type: mediaType
    });
  } catch (error) {
    console.error('Upload endpoint error:', error);
    res.status(500).json({ message: 'Media upload failed' });
  }
});

app.use('/api', router)

// ---- Swagger ----
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

// отдать UI и сам yaml именно под /api/*
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api/swagger.yaml', (_req, res) =>
  res.sendFile(path.join(__dirname, 'swagger.yaml'))
);

// (оставь редирект на удобство, но веди на /api/docs)
app.get('/', (_req, res) => res.redirect('/api/docs'));


//обработка ошибок, последний MiddleWare
app.use(errorHandler)


const start = async() => {
  try{
    await sequelize.authenticate()
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch(e) {
      console.log(e)
  }
  
}

start()
