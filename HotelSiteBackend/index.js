require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const detectFileType = async (filePath) => (await import('file-type')).fileTypeFromFile(filePath)
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const authMiddleware = require('./middleware/authMiddleware')
const checkRole = require('./middleware/checkRoleMiddleware')
const apiSecurity = require('./middleware/apiSecurity')
const { validateEnvironment } = require('./utils/environment')

const PORT = process.env.PORT || 5001

const app = express()
app.disable('x-powered-by')
// All configured /api routes have one edge proxy: Caddy directly to Express.
app.set('trust proxy', 1)
// The public HTML is served by nginx/Caddy, while this process serves the API
// and media. Keep media embeddable from the same public origin, but apply the
// remaining Helmet protections to every API response.
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))
const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(cors(allowedOrigins?.length ? { origin: allowedOrigins, credentials: true } : { origin: process.env.NODE_ENV !== 'production' }))

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
const apiLimiter = rateLimit({ windowMs: 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false });
app.use('/api', apiLimiter, apiSecurity)
app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); })
// JSON в API не содержит медиа: файлы принимаются отдельным защищённым endpoint.
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
// Статика доступна только по явному префиксу; это исключает двойную обработку
// каждого файла и не смешивает API с файловой системой.
app.use('/static', express.static(path.resolve(__dirname, 'static'), {
  setHeaders: (res, filePath) => {
    res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
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
const uploadPolicies = {
  dishes: { extensions: new Set(['.jpg', '.jpeg', '.png', '.webp']), mimeTypes: new Set(['image/jpeg', 'image/png', 'image/webp']), maxBytes: 10 * 1024 * 1024 },
  wines: { extensions: new Set(['.jpg', '.jpeg', '.png', '.webp']), mimeTypes: new Set(['image/jpeg', 'image/png', 'image/webp']), maxBytes: 10 * 1024 * 1024 },
  rooms: { extensions: new Set(['.jpg', '.jpeg', '.png', '.webp']), mimeTypes: new Set(['image/jpeg', 'image/png', 'image/webp']), maxBytes: 10 * 1024 * 1024 },
  news: { extensions: new Set(['.jpg', '.jpeg', '.png', '.webp']), mimeTypes: new Set(['image/jpeg', 'image/png', 'image/webp']), maxBytes: 10 * 1024 * 1024 },
  pages: { extensions: new Set(['.jpg', '.jpeg', '.png', '.webp']), mimeTypes: new Set(['image/jpeg', 'image/png', 'image/webp']), maxBytes: 10 * 1024 * 1024 },
  videos: { extensions: new Set(['.mp4', '.webm']), mimeTypes: new Set(['video/mp4', 'video/webm']), maxBytes: 100 * 1024 * 1024 }
};

// Media changes are admin-only.  The endpoint accepts a deliberately small
// format allowlist; file names, MIME type and target directory are never taken
// from the client unchecked.
const uploadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 40, standardHeaders: 'draft-7', legacyHeaders: false });
// Create one private directory per authorized request; remove it even on disconnect.
const prepareUpload = async (req, res, next) => {
  try {
    const directory = await fs.promises.mkdtemp(path.join(require('os').tmpdir(), 'hotel-upload-'));
    req.uploadTempDirectory = directory;
    const cleanup = () => { void fs.promises.rm(directory, { recursive: true, force: true }).catch(() => {}); };
    res.once('finish', cleanup);
    res.once('close', cleanup);
    next();
  } catch (error) { next(error); }
};
const parseUpload = (req, res, next) => fileUpload({
  limits: { fileSize: 100 * 1024 * 1024, files: 1, fields: 1, parts: 2, fieldSize: 100, fieldNameSize: 50, headerPairs: 50 },
  abortOnLimit: true, useTempFiles: true, tempFileDir: req.uploadTempDirectory,
  uploadTimeout: 30000, responseOnLimit: 'Размер файла превышает допустимый лимит.'
})(req, res, next);
app.post('/api/upload', authMiddleware, checkRole('ADMIN'), uploadLimiter, prepareUpload, parseUpload, async (req, res) => {
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
    const policy = typeof mediaType === 'string' && Object.hasOwn(uploadPolicies, mediaType) ? uploadPolicies[mediaType] : null;
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
    const detectedType = await detectFileType(uploadedFile.tempFilePath);
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
    console.error('Upload endpoint error:', error.name || 'Error');
    res.status(500).json({ message: 'Media upload failed' });
  }
});

app.use('/api', router)

// ---- Swagger ----
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');

const swaggerDocument = YAML.parse(fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8'));

// отдать UI и сам yaml именно под /api/*
app.use('/api/docs', authMiddleware, checkRole('ADMIN'), swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api/swagger.yaml', authMiddleware, checkRole('ADMIN'), (_req, res) =>
  res.sendFile(path.join(__dirname, 'swagger.yaml'))
);

// (оставь редирект на удобство, но веди на /api/docs)
app.get('/', (_req, res) => res.redirect('/api/docs'));


//обработка ошибок, последний MiddleWare
app.use(errorHandler)


const start = async() => {
  try{
    validateEnvironment()
    await sequelize.authenticate()
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch(e) {
      console.error('Backend startup failed:', e.message)
      process.exitCode = 1
  }
  
}

if (require.main === module) start()

module.exports = app;
