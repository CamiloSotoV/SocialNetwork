const router = require('express').Router();
const User = require('./user.route');
const Post = require('./post.route');
const Follow = require('./follow.route');
const Image = require('./image.route');

router.use('/user', User);
router.use('/post', Post);
router.use('/follow', Follow);
router.use('/image', Image);

module.exports = router;