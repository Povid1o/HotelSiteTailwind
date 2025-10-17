require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT || 5001

const app = express()
app.use(cors())
app.use(express.json())
// Normalize duplicate slashes to avoid //static/... 404s
app.use((req, _res, next) => {
  if (typeof req.url === 'string' && req.url.includes('//')) {
    req.url = req.url.replace(/\/+/, '/').replace(/\/+/, '/');
    // Collapse any remaining multiple slashes
    while (req.url.includes('//')) req.url = req.url.replace(/\/+/, '/');
  }
  next()
})
app.use(express.static(path.resolve(__dirname, 'static')))
// Дополнительная настройка для обслуживания файлов из подпапок
app.use('/static', express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))

// Эндпоинт для загрузки файлов (должен быть ПЕРЕД основным роутером)
app.post('/api/upload', (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFile = req.files.file;
    if (!uploadedFile) {
      return res.status(400).json({ message: 'File field is required' });
    }

    // Получаем категорию медиа из параметров запроса
    const mediaType = req.body.type || req.query.type || 'general';
    const allowedTypes = ['dishes', 'wines', 'rooms', 'pages', 'videos', 'general'];
    
    if (!allowedTypes.includes(mediaType)) {
      return res.status(400).json({ message: 'Invalid media type' });
    }

    // Создаём уникальное имя файла
    const fileExtension = path.extname(uploadedFile.name);
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}${fileExtension}`;
    const uploadPath = path.resolve(__dirname, 'static', mediaType, fileName);

    console.log(`Uploading file: ${uploadedFile.name} -> ${mediaType}/${fileName}`);

    uploadedFile.mv(uploadPath, (err) => {
      if (err) {
        console.error('File upload error:', err);
        return res.status(500).json({ message: 'File upload failed', error: err.message });
      }
      
      console.log(`File uploaded successfully: ${mediaType}/${fileName}`);
      
      // Build full URL with protocol and host
      const protocol = req.protocol || 'http';
      const host = req.get('host') || `localhost:${PORT}`;
      const fullUrl = `${protocol}://${host}/static/${mediaType}/${fileName}`;
      
      res.json({ 
        url: fullUrl,
        fileName,
        originalName: uploadedFile.name,
        size: uploadedFile.size,
        type: mediaType
      });
    });
  } catch (error) {
    console.error('Upload endpoint error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.use('/api', router)

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Редирект с корня на Swagger, чтобы было удобно заходить в документацию
app.get('/', (req, res) => {
  res.redirect('/docs');
});

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
        path: '/Винодельня',
        is_active: true,
        content_json: {
          mainBackground: { image: 'https://images.unsplash.com/photo-1468777675496-5782faaea55b?q=80&w=1600&auto=format&fit=crop', title: 'Винодельня' },
          introSection: { title: 'Винодельня', description: 'Откройте для себя мир превосходных вин в нашей винодельне!', image: '', buttonText: 'Ассортимент вин', buttonLink: '/Каталог' },
          historySection: { title: 'НАША ИСТОРИЯ', leftDates: [], rightDates: [] },
          wineSection: { firstText: '', secondText: '', buttonText: 'Наша винотека', buttonLink: '/Каталог' },
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
