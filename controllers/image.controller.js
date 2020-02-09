const models = require('../models');
const uniqid = require('uniqid');
const path = require('path');
const fs = require('fs');

async function saveImage(file, user) {
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
                const add = addImage(nameImage, user);
                if (!add) reject();
                resolve();
            }
        });
    });

}

async function addImage(image, user) {
    const img = await models.Image.create({ user, image });
    if (!img) return false;
    return true;
}

exports.add = async function (req, res, next) {
    try {

        const user = req.headers.id;
        if (!req.files) res.status(400).json('No Files');
        const file = req.files.image;
        if (!file) res.status(400).json('No Image');
        if (!file.mimetype.includes('image')) res.status(400).json('No Type Image');
        await saveImage(file, user)
            .then(response => {
                res.status(200).json('image upload');
            })
            .catch(err => {
                res.status(500).json(err);
            });

    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.query = async function (req, res, next) {
    try {
        const user = req.headers.id;
        const images = await models.Image.find({ user });
        res.status(200).json(images);

    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.remove = async function (req, res, next) {
    try {
        const user = req.headers.id;
        const images = await models.Image.find({ user });
        if (images.length > 0) {
            images.forEach(img => {
                models.Image.findByIdAndDelete(img._id, (err, removed) => {
                    if (err) console.log('Error Deleted');
                    if (removed) console.log('Removed');
                });
            });
            res.status(200).json({ message: 'Images Moved' });
        } else {
            res.status(404).json({ message: 'No Pictures' });
        }

    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}