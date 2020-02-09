const jwt = require('../services/jwt');
const models = require('../models');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const path = require('path');
const fs = require('fs');

async function validarEmail(email) {
    const user = await models.User.findOne({ email });
    if (user) {
        return user;
    } else {
        return false;
    }
}

async function encrypt(password) {
    const encoded = await bcrypt.hash(password, 10);
    return encoded;
}

exports.add = async function (req, res, next) {
    try {
        const exists = await validarEmail(req.body.email);
        let code = '';
        for (let i = 0; i < 3; i++) {
            code = code + (Math.floor((Math.random() * 100) + 1)).toString();
        }
        req.body.code = code;
        if (exists) {
            const state = exists.state;
            if (state) {
                res.status(409).json({ message: 'Correo duplicado' });
            } else {
                const password = await encrypt(req.body.password);
                const user = await models.User.findByIdAndUpdate(exists._id, {
                    name: req.body.name,
                    surname: req.body.surname,
                    gender: req.body.gender,
                    phone: req.body.phone,
                    email: req.body.email,
                    birthday: req.body.birthday,
                    password: password,
                    image: '',
                    state: true
                });
                if (user) res.status(200).json(user);
                if (!user) res.status(404).json({ message: 'Usuario no encontrado' });
            }
        } else {
            req.body.password = await encrypt(req.body.password);
            const user = await models.User.create(req.body);
            if (user) res.status(201).json(user);
            if (!user) res.status(404).json(user);
        }
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.list = async function (req, res, next) {
    try {
        const users = await models.User.find();
        res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.query = async function (req, res, next) {
    try {
        const _id = req.params.id;
        const user = await models.User.findById(_id);
        if (!user) res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.update = async function (req, res, next) {
    try {
        const _id = req.params.id;
        const exists = await validarEmail(req.body.email);
        if (exists && exists._id == _id) {
            const user = await models.User.findByIdAndUpdate(_id, {
                name: req.body.name,
                surname: req.body.surname,
                gender: req.body.gender,
                phone: req.body.phone,
                email: req.body.email,
                birthday: req.body.birthday
            });
            if (user) res.status(200).json(user);
            if (!user) res.status(404).json({ message: 'Usuario no encontrado' });
        } else {
            if (exists && exists._id != _id) {
                res.status(403).json({ message: 'No tienen permisos para actualizar' });
            } else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        }
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.remove = async function (req, res, next) {
    try {
        const _id = req.params.id;
        const user = await models.User.findByIdAndUpdate(_id, { state: false });
        if (user) res.status(200).json(user);
        if (!user) res.status(404).json({ message: 'Usuario no eliminado' });
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

exports.login = async function (req, res, next) {
    try {
        const exists = await validarEmail(req.body.email);
        if (exists) {
            const match = await bcrypt.compare(req.body.password, exists.password);
            if (match) {
                const token = await jwt.encode(exists._id);
                res.status(200).json({ token, usuario: exists });
            } else {
                res.status(404).json({ mensaje: 'Contraseña invalida' });
            }
        } else {
            res.status(404).json({ mensaje: 'Correo invalido' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error interno' });
        next(e);
    }
}

async function saveImage(file, _id) {
    return new Promise((resolve, reject) => {
        // Path 
        const dir = path.resolve(__dirname, '../images/users');
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
                const update = updateDirImage(_id, nameImage);
                if (!update) reject();
                resolve();
            }
        });
    });

}

async function deleteImage(image) {
    const dir = path.resolve(__dirname, `../images/users/${image}`);
    try {
        fs.unlinkSync(dir)
        return true;
    } catch (err) {
        return false;
    }
}

async function updateDirImage(_id, image) {
    const user = await models.User.findByIdAndUpdate(_id, { image });
    if (!user) return false;
    return true;
}

exports.uploadImage = async function (req, res, next) {
    try {
        const _id = req.params.id;
        const user = await models.User.findById(_id);
        if (user) {
            const oldImage = user.image;
            if (!req.files) res.status(400).json('No Files');
            const file = req.files.image;
            if (!file) res.status(400).json('No Image');
            if (!file.mimetype.includes('image')) res.status(400).json('No Type Image');
            await saveImage(file, _id)
                .then(response => {
                    if (oldImage !== '') {
                        deleteImage(oldImage);
                    }
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