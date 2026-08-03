const { Router } = require('express');
const router = Router();
const c = require('../controllers/dishController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/', c.list);
router.post('/', auth, checkRole('ADMIN'), c.create);
router.get('/:id', c.get);
router.put('/:id', auth, checkRole('ADMIN'), c.update);
router.delete('/:id', auth, checkRole('ADMIN'), c.remove);

module.exports = router;
