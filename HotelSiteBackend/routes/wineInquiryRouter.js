const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');
const { Wine } = require('../models/models');
const Settings = require('../models/wineInquirySettings');
const mail = require('../services/wineInquiryMail');
const { createWineInquiryController } = require('../controllers/wineInquiryController');

const router = Router();
const controller = createWineInquiryController({ Wine, Settings, mail });
router.get('/settings', auth, checkRole('ADMIN'), asyncHandler(controller.getSettings));
router.put('/settings', auth, checkRole('ADMIN'), asyncHandler(controller.saveSettings));
router.post('/', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Слишком много заявок. Попробуйте снова через 15 минут.' }
}), asyncHandler(controller.submit));

module.exports = router;
