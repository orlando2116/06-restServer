const express = require('express');
const Producto = require('../models/producto');
const app = express();


const bcrypt = require('bcrypt');
const _ = require('underscore');

const { verificaToken, verificaADMIN_ROLE } = require('../middlewares/autenticacion');

//====================
//obtener todos los prouctos
//popula usuarios y categorias
//====================

app.get('/productos', (req, res) => {
    let desde = Number(req.query.desde) || 0;

    let hasta = Number(req.query.hasta) || 5;

    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                productos: productosDB
            });
        });
});



//====================
//obtener producto por id
//popula usuarios y categorias
//====================

app.get('/productos/:id', (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });

});

//====================
//buscar productos
//====================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    //creamos exprexion regular, y buscamos. la 'i' es para que no diferencia mayusc. y minusc.
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'email nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});


app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar categoria

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err: err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//====================
//actualizar producto
//====================

app.put('/productos/:id', (req, res) => {
    let id = req.params.id;

    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err: err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});



//====================
//borrar producto
//====================
app.delete('/productos/:id', (req, res) => {
    let id = req.params.id;

    let disponible = { disponible: false };
    Producto.findByIdAndUpdate(id, disponible, (err, productoDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err: err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});
module.exports = app;