const Router = require('express');
const router = new Router();

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

module.exports = router;
