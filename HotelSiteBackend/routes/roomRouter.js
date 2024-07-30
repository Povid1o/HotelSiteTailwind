const Router = require('express')
const roomController = require('../controllers/roomController')
const router = new Router()
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), roomController.create)
router.get('/', roomController.getAll)
router.get('/:id', roomController.getOne)
router.delete('/:id', checkRole('ADMIN'), roomController.delete)
router.put('/:id', checkRole('ADMIN'), roomController.update)

module.exports = router