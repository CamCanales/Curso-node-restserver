const Role = require('../models/role');
const { Usuario , Categoria, Producto} = require('../models');

const esRoleValido = async(rol='')=> {

    const existeRol = await Role.findOne({ rol });
    if(!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const emailExiste = async(correo = '' ) =>{
    //-->   VERIFICAR SI EL CORREO EXISTE
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail){
        throw new Error(`El correo : ${correo}, ya está registrado`);
    }
}

const existeUsuarioPorId = async(id) =>{
    //-->   VERIFICAR SI EL CORREO EXISTE
    const existeUsuario  = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`El Id no existe : ${id}`);
    }
}

//CREA VALIDADOR DE CATEGORIA 
const existeCategoriaPorId = async(id) =>{
    //-->   VERIFICAR SI EL CORREO EXISTE
    const existeCategoria  = await Categoria.findById(id);
    if(!existeCategoria){
        throw new Error(`El Id no existe : ${id}`);
    }
}

//CREA VALIDADOR DE PRODUCTO 
const existeProductoPorId = async(id) =>{
    //-->   VERIFICAR SI EL CORREO EXISTE
    const existeProduto  = await Producto.findById(id);
    if(!existeProduto){
        throw new Error(`El Id no existe : ${id}`);
    }
}

 module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
 }


