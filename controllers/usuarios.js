const {response} = require('express');


const usuariosGet = (req, res = response) => {

    //--http://localhost:8080/api/usuarios?q=hola&apikey=12345660&page=1&limit=200
    const {q,nombre='No Name',apikey, page=1, limit } = req.query;  //----> (nombre='No Name') ASIGNA VALOR POR DEFECTO 

    res.json({
        msg:'put API - controlador',
        q,
        nombre,
        apikey,
        page, limit
    });
}

const usuariosPost = (req, res = response) => {

    const {nombre, edad}  = req.body; //----> OBTIENE VARIABLES DESESTRUCTURADAS DESDE EL REQUEST

    res.json({
        msg:'post API - usuariosPost',
        nombre, edad
    })
}

const usuariosPut = (req, res = response) => {

    const {id }  = req.params; //--->  OBTIENE DESESTRUCTURACION DE PARAMETROS ADICIONALES

    res.json({
        msg:'put API - usuariosPut',
        id
    })
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg:'patch API - usuariosPatch'
    })
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg:'delete API - usuariosDelete'
    })
}


module.exports= {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}

