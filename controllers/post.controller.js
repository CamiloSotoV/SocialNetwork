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

async function saveImage(file, _id, body) {
    return new Promise((resolve, reject) => {
        // Path 
        const dir = path.resolve(__dirname, '../images/posts');
        const exists = fs.existsSync(dir);
        if (!exists) {
            fs.mkdirSync(dir);
        }
        // Name
        const array = file.name.split('.');
        const ext = array[array.length - 1];
        const id = uniqid();
        const nameImage = `${id}.${ext}`;
        file.mv(`${dir}/${nameImage}`, (err) => {
            if (err) {
                reject(err);
            }
            else {
                const add = addImage(nameImage, body);
                if (!add) reject();
                resolve();
            }
        });
    });

}

async function addImage(nameImage, body) {
    const post = await models.Post.create({ user: body.user, description: body.description, imgs: nameImage });
    if (!post) return false;
    return true;
}

exports.add = async function (req, res, next) {
    try {
        const _id = req.headers.id;
        const body = {
            user: _id,
            description: req.body.description
        }
        const existe = validarId(_id);
        if (existe) {
            if (!req.files) res.status(400).json('No Files');
            const file = req.files.image;
            if (!file) res.status(400).json('No Image');
            if (!file.mimetype.includes('image')) res.status(400).json('No Type Image');
            await saveImage(file, _id, body)
                .then(response => {
                    res.status(200).json('image upload');
                })
                .catch(err => {
                    res.status(500).json(err);
                });

        } else {
            res.status(404).json({ mensaje: 'Registro no encontrado' });
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

