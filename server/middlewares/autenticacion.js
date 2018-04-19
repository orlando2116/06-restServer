const jwt = require('jsonwebtoken');

//verificar token

//next continua ejecucion de programa
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    //validamos token valido
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: err
            })
        }

        req.usuario = decoded.usuario;
        //se usa para que siga lo que viene despues de esta funcion, osea los datos de las apis
        next();
    });


};

module.exports = { verificaToken };