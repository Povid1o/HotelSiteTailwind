const Router = require('express');
const wineController = require('../controllers/wineController')
const router = new Router();
const checkRole = require('../middleware/checkRoleMiddleware');


// === Wines ===
router.post('/', checkRole('ADMIN'), wineController.create);
router.get('/', wineController.getAll);
router.get('/:id', wineController.getOne);
router.put('/:id', checkRole('ADMIN'), wineController.update);
router.delete('/:id', checkRole('ADMIN'), wineController.delete);

module.exports = router;
