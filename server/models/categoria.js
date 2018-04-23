const mongoose = require('mongoose');


//obtenemos y definimos esquema
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'la categoria es necesario'] //definimos parametros de esquema. y mandamos mensaje en caso de que no escriba el nombre en algun caso
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


//modelo se llamara usuario, y tendra configuracion de usuarioSchema
module.exports = mongoose.model('Categoria', categoriaSchema);