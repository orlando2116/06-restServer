const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseHidden = require('mongoose-hidden');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};
//obtenemos y definimos esquema
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'] //definimos parametros de esquema. y mandamos mensaje en caso de que no escriba el nombre en algun caso
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'la contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(mongooseHidden, { hidden: { password: true } });
//unique
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' })

//modelo se llamara usuario, y tendra configuracion de usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema);