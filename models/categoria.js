const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({
    nombre:{
        type: String,
        required:[true, 'el nombre es obligatorio'],
        unique: true
    },
    estado:{
        type: Boolean,
        default: true,
        required: true
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

// PERMITE QUITAR PROPIEDADES A LA RESPUESTA DESESTRUCTURANDO EL OBJETO
CategoriaSchema.methods.toJSON = function() {
    const {__v, estado, ...data} = this.toObject(); //----> DESESTRUCTURA EL OBJETO; QUITANDO LOS ATRIBUTOS "__V", "PASSWORD" ,"ROL" y "_ID" PARA DEVOLVER EL OBJETO "USUARIO" FINALMENTE
    return data;  
}

module.exports = model('Categoria',CategoriaSchema);

