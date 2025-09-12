const Router = require('express');
const router = new Router();
const c = require('../controllers/wineController');

router.get('/tree', c.tree);
router.post('/', c.create);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
