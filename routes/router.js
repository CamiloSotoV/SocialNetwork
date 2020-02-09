const router = require('express').Router();
const User = require('./user.route');
const Post = require('./post.route');
const Follow = require('./follow.route');

router.use('/user', User);
router.use('/post', Post);
router.use('/follow', Follow);

module.exports = router;