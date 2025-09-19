const Router = require('express');
const videoController = require('../controllers/videoController')
const router = new Router();
const checkRole = require('../middleware/checkRoleMiddleware');


// === Wines ===
router.post('/', checkRole('ADMIN'), videoController.create);
router.get('/', videoController.getAll);
router.get('/:id', videoController.getOne);
router.put('/:id', checkRole('ADMIN'), videoController.update);
router.delete('/:id', checkRole('ADMIN'), videoController.delete);

module.exports = router;