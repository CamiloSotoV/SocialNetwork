const router = require('express').Router();
const controller = require('../controllers/follow.controlle');

router.post('/create/:id', controller.add);
router.get('/followers', controller.followers);
router.get('/followings', controller.followings);
router.get('/query/:follower/:following', controller.query);
router.get('/count/:id', controller.count);
router.delete('/remove/:following', controller.remove);

module.exports = router;