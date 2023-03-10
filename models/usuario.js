const { Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE','USER_ROLE']
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
});

UsuarioSchema.methods.toJSON = function() {
    const {__v, password, rol,  ...usuario} = this.toObject(); //----> DESESTRUCTURA EL OBJETO; QUITANDO LOS ATRIBUTOS "__V", "PASSWORD" Y "ROL" PARA DEVOLVER EL OBJETO "USUARIO" FINALMENTE
    return usuario;  
}

module.exports= model('Usuario', UsuarioSchema);