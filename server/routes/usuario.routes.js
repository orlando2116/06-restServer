const express = require('express');
const Usuario = require('../models/usuario');
const app = express();


const bcrypt = require('bcrypt');
const _ = require('underscore');

const { verificaToken, verificaADMIN_ROLE } = require('../middlewares/autenticacion');

app.get('/usuario', verificaToken, (req, res) => {

    //aca ya tenemos al usuario, seteado y rescatado del verifica token
    //p<ra comprobarlo podemos ver lo siguente
    console.log(req.usuario);
    let desde = Number(req.query.desde) || 0;

    let hasta = Number(req.query.hasta) || 5;

    //listar usuarios, paginados y que campo queremos mostrar
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(hasta)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            Usuario.count({}, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err: err
                    });
                }

                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cantidad: conteo
                })
            });

        })
});




app.post('/usuario', [verificaToken, verificaADMIN_ROLE], function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', [verificaToken, verificaADMIN_ROLE], function(req, res) {
    let id = req.params.id;
    //libreria instalada. esto sirve para seleccionar solo algunas propiedades de un objeto en particular.
    //en este caso password ni sesion con google se deberian poder actualizar
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //id a actualizar, body para actualizarlo, y el new:true devuelv eel usuario ya actualizado
    //run validator corrre validaciones del exquema
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });


});

app.delete('/usuario/:id', [verificaToken, verificaADMIN_ROLE], function(req, res) {

    let id = req.params.id;
    /* Usuario.findByIdAndRemove(id, (err, userDeleted) => {
         if (err) {
             return res.status(400).json({
                 ok: false,
                 err: err
             });
         }
         if (!userDeleted) {
             return res.status(400).json({
                 ok: false,
                 err: {
                     message: 'usuario no encontrado'
                 }
             });
         }
         res.json({
             ok: true,
             usuario: userDeleted
         });
     })*/

    let obj = { estado: false }
    Usuario.findByIdAndUpdate(id, obj, { new: true }, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: userDeleted
        });
    });
});


module.exports = app;