const Router = require('express');
const router = new Router();

// Healthcheck для корня /api, чтобы не получать "Cannot GET /api"
router.get('/', (req, res) => {
  res.json({ status: 'ok', name: 'Hotel API', version: '1.0.1' });
});

// Auth / Users
router.use('/user', require('./userRouter'));        // registration/login/check

// Legacy каталог
router.use('/type', require('./typeRouter'));
router.use('/clase', require('./claseRouter'));
router.use('/product', require('./productRouter'));

// Новые по ТЗ
router.use('/dishes', require('./dishRouter'));
router.use('/rooms', require('./roomRouter'));
router.use('/wines', require('./wineRouter'));
router.use('/pages', require('./pageRouter'));

// справочники для блюд/вин
router.use('/dish-categories', require('./dishCategoryRouter'));
router.use('/wine-types', require('./wineTypeRouter'));
router.use('/wine-sweetness', require('./wineSweetnessRouter'));


module.exports = router;
