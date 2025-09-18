const Router = require('express');
const router = new Router();
const claseController = require('../controllers/claseContoller')
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), claseController.create);
router.get('/', claseController.getAll);

module.exports = router;
