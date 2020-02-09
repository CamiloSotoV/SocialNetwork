const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bd_url = 'mongodb+srv://olimpusmac:1014299767Casv@sorteos-yly5t.mongodb.net/Social_Network?retryWrites=true&w=majority';
mongoose.connect(bd_url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(mongoose => console.log('Base de Datos Conectada'))
    .catch(err => console.log(err));