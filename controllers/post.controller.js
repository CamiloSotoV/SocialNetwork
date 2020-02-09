const models = require('../models');
const uniqid = require('uniqid');
const path = require('path');
const fs = require('fs');

async function validarId(_id) {
    const user = await models.User.findById(_id);
    if (user) {
        return user;
    } else {
        return false;
    }
}

async function deleteImage(image) {
    console.log({ image });
    const dir = path.resolve(__dirname, `../images/posts/${image}`);
    try {
        fs.unlinkSync(dir)
        return true;
    } catch (err) {
        return false;
    }
}


exports.add = async function (req, res, next) {
    try {
        req.body.user = req.headers.id;
        const post = await models.Post.create(req.body);
        if (!post) {
            res.status(400).json({ message: 'Bad request' });
        } else {
            res.status(201).json(post);
        }
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.list = async function (req, res, next) {
    try {
        const following = await models.Follow.find({ Following: req.headers.id });
        let arrayFollowing = [];
        following.forEach(followed => arrayFollowing.push(followed.follower));
        posts = await models.Post.find({ user: { "$in": arrayFollowing } });
        res.status(200).json({ posts, count: posts.length });
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.query = async function (req, res, next) {
    try {
        const _id = req.params.id;
        const posts = await models.Post.findById(_id);
        res.status(200).json(posts);
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.getImage = async function (req, res, next) {
    try {
        const image = req.params.image;
        const dirImage = path.resolve(__dirname, '../images/posts/', image);
        const existe = fs.existsSync(dirImage);
        if (!existe) {
            const defaultImage = path.resolve(__dirname, '../assets/400x250.jpg');
            const existe2 = fs.existsSync(defaultImage);
            console.log({ existe2, defaultImage });
            res.sendFile(defaultImage);
        } else {
            res.sendFile(dirImage);
        }

    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.myPosts = async function (req, res, next) {
    try {
        const _id = req.headers.id;
        const posts = await models.Post.findById(_id);
        res.status(200).json(posts);
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.remove = async function (req, res, next) {
    try {
        const _id = req.params.id;
        const post = await models.Post.findById(_id);
        if (post.user == req.headers.id) {
            const del = await deleteImage(post.imgs);
            console.log({ del });
            if (!del) res.status(400).json({ message: 'Image dont Delete' });
            const deleted = await models.Post.findByIdAndDelete(_id);
            if (!deleted) res.status(400).json({ message: 'Post dont Delete' });
            res.status(200).json(post);
        } else {
            res.status(403).json({ message: 'Sin autorizacion' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

