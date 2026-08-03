// routes/dishCategoryRouter.js
const { Router } = require('express');
const router = Router();
const c = require('../controllers/dishCategoryController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/', c.list);
router.post('/', auth, checkRole('ADMIN'), c.create);
router.put('/:id', auth, checkRole('ADMIN'), c.update); // поддержка обновления по id или имени
router.delete('/:id', auth, checkRole('ADMIN'), c.remove);

module.exports = router;
