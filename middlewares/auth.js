const jwt = require('../services/jwt');

exports.verificar = async function (req, res, next) {
    try {
        if (!req.headers.token) {
            res.status(401).json({ mensaje: 'No hay Token' });
        } else {
            const response = await jwt.decode(req.headers.token);
            if (response) next();
            if (!response) res.status(403).json('Token invalido');
        }
    } catch (e) {
        res.status(500).json({ mensaje: 'Error Token ' });
    }
}