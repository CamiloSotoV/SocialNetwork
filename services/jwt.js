const models = require('../models');
const jwt = require('jsonwebtoken');

exports.encode = async function (_id) {
    const token = jwt.sign({ _id: _id }, 'SolMananaLunaNoche', { expiresIn: '1d' });
    return token;
}
exports.decode = async function (token) {
    try {
        const { _id } = await jwt.verify(token, 'SolMananaLunaNoche');
        const usuario = await models.Usuario.findOne({ _id });
        if (usuario) return usuario;
        if (!usuario) return false;
    } catch (e) {
        return false;
    }
}