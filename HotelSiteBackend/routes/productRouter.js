const Router = require('express');
const productController = require('../controllers/productController');
const models = require('../models/models')
const router = new Router();
const checkRole = require('../middleware/checkRoleMiddleware');

// === Products ===
// router.post('/', checkRole('ADMIN'), productController.create);
// router.get('/', productController.getAll);
// router.get('/:id', productController.getOne);
// router.put('/:id', checkRole('ADMIN'), productController.update);
// router.delete('/:id', checkRole('ADMIN'), productController.delete);
router.post('/', models, productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.put('/:id', models, productController.update);
router.delete('/:id', models, productController.delete);

module.exports = router;
