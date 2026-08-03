const { Router } = require('express');
const router = Router();
const c = require('../controllers/wineController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/tree', c.tree);
router.post('/tree', auth, checkRole('ADMIN'), c.create);
router.post('/', auth, checkRole('ADMIN'), c.create);
router.put('/:id', auth, checkRole('ADMIN'), c.update);
router.delete('/:id', auth, checkRole('ADMIN'), c.remove);

module.exports = router;
