const router = require('express').Router();
const controller = require('../controllers/image.controller');

router.post('/add', controller.add);
router.get('/query', controller.query);
router.delete('/remove', controller.remove);

module.exports = router;