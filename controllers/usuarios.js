const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');



const usuariosGet = async(req, res = response) => {

    //--http://localhost:8080/api/usuarios?q=hola&apikey=12345660&page=1&limit=200
    /*
    const {q,nombre='No Name',apikey, page=1, limit } = eq.query;  //----> (nombre='No Name') ASIGNA VALOR POR DEFECTO 

    res.json({
        msg:'put API - controlador',
        q,
        nombre,
        apikey,
        page, limit
    });
    */

    //----> DEVUELVE LOS USUARIOS PAGINADOS CON RANGOS DE INICIO (DESDE ) HASTA (LIMTE)
    const { limite = 5, desde = 0} = req.query; //-->ARGUMENTOS OPCIONALES DE LA URL
    const query = {estado: true}; //--> TRAE SOLO LOS QUE SON ESTADO TRUE
    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments(query);

    //-> EJECUTA LAS 2 PROMESAS DE MANERA SIMULTANEA, PERO SI ALGUNA DA ERROR, TODAS DAN ERROR
    //-> SON POSICIONALES; SI LA 2dA PROMESA TERMINA PRIMERO SE ACCEDE MEDIANTE USUARIOS. LA PRIMERA PROMESA MEDIANTE TOTAL
    const [ total, usuarios]  = await Promise.all([ 
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total, 
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {

    //const {nombre, edad}  = req.body; //----> OBTIENE VARIABLES DESESTRUCTURADAS DESDE EL REQUEST
    const { nombre, correo, password, rol} = req.body; //----> OBTIENE VARIABLES DESESTRUCTURADAS DESDE EL REQUEST
    const usuario = new Usuario({nombre, correo, password, rol}); //---> CREA UNA ISNTANCIA DE USUARIO    
   

    //ENCRIPTAR LA CONTRASEÑA
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync( password, salt);

    //GUARDAR EN BD
  
    await usuario.save();

    res.json({
        //msg:'post API - usuariosPost',
        usuario
        //nombre, edad  //----> OBTIENE VARIABLES DESESTRUCTURADAS DESDE EL REQUEST
        
    })
}

const usuariosPut = async(req, res = response) => {

    const {id }  = req.params; //--->  OBTIENE DESESTRUCTURACION DE PARAMETROS ADICIONALES
    const { _id, password, google, correo, ...resto} = req.body; //---->DESESTRUCTURA EL BODY Y OBTIENE PASSWORD Y GOOGLE COMO PARAMETROS; EL RESTO DE PARAMETROS VIENEN EL PARAM "RESTO"

    //TODO Validar contra base de datos
    if(password){
        //ENCRIPTAR LA CONTRASEÑA
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync( password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({usuario})
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg:'patch API - usuariosPatch'
    })
}

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;

    //SE BORRARA FISICAMENTE DESDE BD
    //const usuario = await Usuario.findByIdAndDelete(id);    

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json(usuario)
}


module.exports= {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}

