const Router = require('express');
const router = new Router();
const c = require('../controllers/roomController');

router.get('/', c.list);
router.post('/', c.create);
router.get('/:id', c.get);
router.put('/:id', c.update);
router.delete('/:id', c.remove);
router.patch('/:id/toggle-active', c.toggleActive);

module.exports = router;
