const express = require('express');
const Categoria = require('../models/categoria');
const app = express();


const bcrypt = require('bcrypt');
const _ = require('underscore');

const { verificaToken, verificaADMIN_ROLE } = require('../middlewares/autenticacion');

app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('descripcion') //ordena
        .populate('usuario', 'nombre email') //rellena campo usuario y le decimos que campos queremos
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                categorias: categoriasDB
            });
        })
});

app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });

});

app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    console.log(req.usuario);
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });

});

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});


app.delete('/categoria/:id', [verificaToken, verificaADMIN_ROLE], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDeleted
        })
    });
});

module.exports = app;