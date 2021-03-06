require('./config/config');
const path = require('path');
const express = require('express');

// Using Node.js `require()`
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



//habilitar carpeta public para poder llerla de todos lados
app.use(express.static(path.resolve(__dirname, '../public')));



app.use(require('./routes/index.routes'));


mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) {
        throw err;
    }

    console.log('base de datos online');
});


app.listen(process.env.PORT, () => {
    console.log('escuchando puerto ', process.env.PORT);
});