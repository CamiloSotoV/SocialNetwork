const router = require('express').Router();
const controller = require('../controllers/post.controller');

router.post('/create', controller.add);
router.get('/list', controller.list);
router.get('/query/:id', controller.query);
router.get('/posts', controller.myPosts);
router.delete('/remove/:id', controller.remove);

module.exports = router;