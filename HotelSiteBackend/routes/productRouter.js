const Router = require('express')
const productController = require('../controllers/productController')
const router = new Router()
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), productController.create)
router.get('/', productController.getAll)
router.get('/:id', productController.getOne)

module.exports = router