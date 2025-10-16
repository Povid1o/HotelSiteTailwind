// routes/dishCategoryRouter.js
const Router = require('express');
const router = new Router();
const c = require('../controllers/dishCategoryController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/', c.list);
router.post('/', checkRole('ADMIN'), c.create);
router.put('/:id', checkRole('ADMIN'), c.update); // поддержка обновления по id или имени
router.delete('/:id', checkRole('ADMIN'), c.remove);

module.exports = router;
