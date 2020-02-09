const models = require('../models');

async function validarId(_id) {
    const user = await models.User.findById(_id);
    if (user) {
        return user;
    } else {
        return false;
    }
}

exports.add = async function (req, res, next) {
    try {
        const userId = await validarId(req.headers.id);
        const user = await validarId(req.params.id);
        if (userId && user) {
            const follow = await models.Follow.create({ Following: user, follower: userId });
            if (!follow) res.status(400).json({ message: 'follow no guardado' });
            res.status(201).json(follow);
        } else {
            res.status(404).json({ menssage: 'Usuarios no encontrado' });
        }

    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.followings = async function (req, res, next) {
    try {
        const follower = req.headers.id;
        const followings = await models.Follow.find({ follower });
        res.status(200).json(followings);
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.followers = async function (req, res, next) {
    try {
        const Following = req.headers.id;
        const followers = await models.Follow.find({ Following });
        res.status(200).json(followers);
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.query = async function (req, res, next) {
    try {
        const follower = req.params.follower;
        const following = req.params.following;
        const follow = await models.Follow.findOne({ follower, following });
        res.status(200).json(follow);
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.remove = async function (req, res, next) {
    try {
        const follower = req.headers.id;
        const Following = req.params.Following;
        const unfollow = await models.Follow.findOneAndDelete({ follower, Following });
        res.status(200).json(unfollow);
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.count = async function (req, res, next) {
    try {
        const user = req.params.id;
        const follows = await models.Follow.find({ Following: user }).countDocuments();
        const followings = await models.Follow.find({ follower: user }).countDocuments();
        const post = await models.Post.find({ user }).countDocuments();
        res.status(200).json({ follows, followings, post });
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}