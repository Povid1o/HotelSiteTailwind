const { Router } = require('express');
const router = Router();
const c = require('../controllers/newsController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

// Админские маршруты объявлены раньше `/:slug`, иначе «admin» стал бы адресом новости.
router.get('/admin', auth, checkRole('ADMIN'), c.adminList);
router.get('/admin/:id', auth, checkRole('ADMIN'), c.adminGet);
router.post('/admin', auth, checkRole('ADMIN'), c.create);
router.put('/admin/:id', auth, checkRole('ADMIN'), c.update);
router.delete('/admin/:id', auth, checkRole('ADMIN'), c.remove);

router.get('/', c.list);
router.get('/:slug', c.getBySlug);

module.exports = router;
