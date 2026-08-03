const { Router } = require('express')
const router = Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

// New accounts are created by an authenticated administrator only.  The public
// site has no self-service registration flow, so this route must never be an
// escalation path to the admin panel.
router.post('/registration', authMiddleware, checkRole('ADMIN'), userController.registration)
router.post('/login',userController.login)
router.get('/auth',authMiddleware, userController.check)
router.post('/logout', userController.logout)


module.exports = router
