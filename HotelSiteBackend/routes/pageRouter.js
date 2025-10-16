const Router = require('express');
const router = new Router();
const c = require('../controllers/pageController');

router.get('/', c.list);
router.post('/', c.create);
router.get('/:id', c.get);
router.put('/:id', c.update);
router.patch('/:id/content', c.update);
router.patch('/:id/toggle-active', c.toggleActive);
router.delete('/:id', c.remove);

module.exports = router;
