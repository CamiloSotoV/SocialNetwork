const routes = require('./routes/router');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();
const fileUpload = require('express-fileupload');

require('./database/database');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(fileUpload());
app.use(cors());

app.use('/api', routes);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log(`servidor en el puerto ${app.get('port')}`);
});