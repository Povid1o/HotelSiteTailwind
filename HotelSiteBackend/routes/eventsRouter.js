const { Router } = require('express');
const router = Router();
const c = require('../controllers/eventsController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

// Categories
router.get('/categories', c.getAllCategories);
router.put('/categories/:id', auth, checkRole('ADMIN'), c.updateCategory);

// Events
router.get('/', c.getAllEvents);
router.get('/:id', c.getEventById);
router.post('/', auth, checkRole('ADMIN'), c.createEvent);
router.put('/:id', auth, checkRole('ADMIN'), c.updateEvent);
router.delete('/:id', auth, checkRole('ADMIN'), c.deleteEvent);

module.exports = router;

