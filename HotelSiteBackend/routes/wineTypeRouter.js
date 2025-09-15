// routes/wineTypeRouter.js
const Router = require('express');
const router = new Router();
const c = require('../controllers/wineTypeController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/', c.list);
router.post('/', checkRole('ADMIN'), c.create);
router.delete('/:id', checkRole('ADMIN'), c.remove);

module.exports = router;
