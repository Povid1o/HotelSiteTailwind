const { Router } = require('express');
const router = Router();
const c = require('../controllers/analyticsController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/dashboard', auth, checkRole('ADMIN'), c.dashboard);

module.exports = router;
