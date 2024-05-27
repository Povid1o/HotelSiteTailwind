const Router = require('express')
const router = new Router()
const claseContoller = require('../controllers/claseContoller')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), claseContoller.create)
router.get('/', claseContoller.getAll)

module.exports = router