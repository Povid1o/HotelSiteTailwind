const { Router } = require('express');
const router = Router();
const c = require('../controllers/pageController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/', c.list);
router.post('/', auth, checkRole('ADMIN'), c.create);
router.get('/:id', c.get);
router.put('/:id', auth, checkRole('ADMIN'), c.update);
router.patch('/:id/content', auth, checkRole('ADMIN'), c.updateSection);
router.patch('/:id/toggle-active', auth, checkRole('ADMIN'), c.toggleActive);
router.delete('/:id', auth, checkRole('ADMIN'), c.remove);

module.exports = router;
