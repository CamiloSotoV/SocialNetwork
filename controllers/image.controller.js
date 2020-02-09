const jwt = require('../services/jwt');
const models = require('../models');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const path = require('path');
const fs = require('fs');

async function saveImage(file, _id) {
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
                const add = addImage(_id, nameImage);
                if (!add) reject();
                resolve();
            }
        });
    });

}

async function addImage(image) {
    const dir = path.resolve(__dirname, `../images/pots/${image}`);
    try {
        fs.unlinkSync(dir)
        return true;
    } catch (err) {
        return false;
    }
}

async function add(post, image) {
    const user = await models.Image.create({ post, image });
    if (!user) return false;
    return true;
}

exports.uploadImage = async function (req, res, next) {
    try {
        const _id = req.params.id;
        const post = await models.Post.findById(_id);
        if (post) {
            if (!req.files) res.status(400).json('No Files');
            const file = req.files.image;
            if (!file) res.status(400).json('No Image');
            if (!file.mimetype.includes('image')) res.status(400).json('No Type Image');
            await saveImage(file, _id)
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