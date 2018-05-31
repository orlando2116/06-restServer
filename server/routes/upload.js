const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());
//si es usuario  producto y el id
app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    //validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'tipo no valido'
            }
        });
    }


    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    let nombreArchivo = archivo.name.split('.')[0];
    let extension = archivo.name.split('.')[1];
    //extensiones validar
    const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'extension no valida'
            }
        });
    }


    //cambiar nombre al archivo, debe ser unico

    let nuevoNombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nuevoNombreArchivo} `, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err: err
            });

        //cargar imagen

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nuevoNombreArchivo);

        } else {

        }


    });


});

function imagenUsuario(id, res, nuevoNombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        console.log(usuarioDB.img);
        let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);

        //si existe se borra
        if (fs.existsSync(pathImagen)) {
            console.log("existe");
            fs.unlinkSync(pathImagen);
        }


        usuarioDB.img = nuevoNombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nuevoNombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nuevoNombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }
            });
        }

        console.log(productoDB.img);
        let pathImagen = path.resolve(__dirname, `../../uploads/productos/${productoDB.img}`);

        //si existe se borra
        if (fs.existsSync(pathImagen)) {
            console.log("existe");
            fs.unlinkSync(pathImagen);
        }

        productoDB.img = nuevoNombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nuevoNombreArchivo
            });
        });
    });
}

module.exports = app;