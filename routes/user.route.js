const router = require('express').Router();
const controller = require('../controllers/user.controller');

router.post('/create', controller.add);
router.post('/login', controller.login);
router.get('/list', controller.list);
router.get('/query/:id', controller.query);
router.put('/update/:id', controller.update);
router.put('/upload/:id', controller.uploadImage);
router.delete('/remove/:id', controller.remove);

module.exports = router;
