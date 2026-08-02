require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const authMiddleware = require('./middleware/authMiddleware')
const checkRole = require('./middleware/checkRoleMiddleware')

const PORT = process.env.PORT || 5001

const app = express()
app.use(cors())
// ✅ Увеличиваем лимит для JSON body до 100MB
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))
// Normalize duplicate slashes to avoid //static/... 404s
app.use((req, _res, next) => {
  if (typeof req.url === 'string' && req.url.includes('//')) {
    req.url = req.url.replace(/\/+/, '/').replace(/\/+/, '/');
    // Collapse any remaining multiple slashes
    while (req.url.includes('//')) req.url = req.url.replace(/\/+/, '/');
  }
  next()
})

// Логирование запросов к статическим файлам (для отладки)
app.use('/static', (req, res, next) => {
  console.log(`📁 Static file request: ${req.url} | Method: ${req.method}`);
  next();
});

// Настройка статических файлов с явным указанием MIME-типов для видео
app.use(express.static(path.resolve(__dirname, 'static'), {
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
// Дополнительная настройка для обслуживания файлов из подпапок
app.use('/static', express.static(path.resolve(__dirname, 'static'), {
  setHeaders: (res, filePath) => {
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
    res.setHeader('Accept-Ranges', 'bytes');
  }
}))
// ✅ Увеличиваем лимит для загрузки файлов до 100MB
app.use(fileUpload({
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
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
    await sequelize.sync()

    // Seed default wine types, sweetness and pages
    const { WineType, WineSweetness, Page } = models
    // wine types
    for (const name of ['красное','белое','розовое']) {
      await WineType.findOrCreate({ where: { name } })
    }
    // sweetness
    for (const name of ['сухое','полусухое','полусладкое','сладкое']) {
      await WineSweetness.findOrCreate({ where: { name } })
    }
    // pages
    const pagesSeed = [
      {
        name: 'Главная',
        path: '/',
        is_active: true,
        content_json: {
          mainBackground: {
            image: 'https://images.unsplash.com/photo-1508258470050-ef421c36e6de?q=80&w=1600&auto=format&fit=crop',
            title: 'Добро пожаловать на Винные Террасы'
          },
          aboutSection: {
            title: 'Кто мы?',
            description: 'Отель-винодельня "Винные Террасы" — это уникальное место, сочетающее шарм и гостеприимство с изысканными винами.'
          },
          firstGallery: { title: 'Номерной Фонд', images: [] },
          secondGallery: { title: 'Отель расположен в самой живописной локации Абрау', images: [] },
          videoSection: { title: 'Посмотрите видео-презентацию', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          servicesSection: { title: 'Ваш отдых — наша ответственность', services: [] }
        }
      },
      {
        name: 'Винодельня',
        path: '/Vinery',
        is_active: true,
        content_json: {
          mainBackground: { image: 'https://images.unsplash.com/photo-1468777675496-5782faaea55b?q=80&w=1600&auto=format&fit=crop', title: 'Винодельня' },
          introSection: { title: 'Винодельня', description: 'Откройте для себя мир превосходных вин в нашей винодельне!', image: '', buttonText: 'Ассортимент вин', buttonLink: '/Shop' },
          historySection: { title: 'НАША ИСТОРИЯ', leftDates: [], rightDates: [] },
          wineSection: { firstText: '', secondText: '', buttonText: 'Наша винотека', buttonLink: '/Shop' },
          productionSection: { title: 'ЭТАПЫ НАШЕГО ПРОИЗВОДСТВА', stages: [] },
          regionSection: { title: 'ВИННЫЙ РЕГИОН', firstText: '', secondText: '', backgroundImage: '' }
        }
      }
    ]
    for (const p of pagesSeed) {
      const exists = await Page.findOne({ where: { name: p.name } })
      if (!exists) await Page.create(p)
    }

    // Seed event categories
    const seedEvents = require('./seed/seedEvents');
    await seedEvents();

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch(e) {
      console.log(e)
  }
  
}

start()
