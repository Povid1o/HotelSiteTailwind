const Router = require('express');
const dishController = require('../controllers/dishController');
const router = new Router();
const checkRole = require('../middleware/checkRoleMiddleware');

// === Dishes ===
router.post('/', checkRole('ADMIN'), dishController.create);
router.get('/', dishController.getAll);
router.get('/:id', dishController.getOne);
router.put('/:id', checkRole('ADMIN'), dishController.update);
router.delete('/:id', checkRole('ADMIN'), dishController.delete);

module.exports = router;