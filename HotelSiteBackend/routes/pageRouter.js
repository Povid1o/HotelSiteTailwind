const Router = require('express');
const pageController = require('../controllers/pageController');
const router = new Router();
const checkRole = require('../middleware/checkRoleMiddleware');

// === Pages ===
router.post('/', checkRole('ADMIN'), pageController.create);
router.get('/', pageController.getAll);
router.get('/:id', pageController.getOne);
router.put('/:id', checkRole('ADMIN'), pageController.update);
router.delete('/:id', checkRole('ADMIN'), pageController.delete);

module.exports = router;