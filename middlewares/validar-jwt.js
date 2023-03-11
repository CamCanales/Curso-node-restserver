const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT= async(req= request, res = response, next)=>{

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg:'No hay token en la peticion'
        });
    }

    try{

        const { uid } = jwt.verify(token, process.env.SECREATORPRIVATEKEY);

        //Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if(!usuario)
        {
            return res.status(401).json({
                msg:'Token no valido - Usuario no existente en BD'
            })
        }
        
        //verificar si el uid tiene estado en true
        if(!usuario.estado)
        {
            return res.status(401).json({
                msg:'Token no valido - Usuario con estado false'
            })
        }
        


        req.usuario = usuario;
        next();
    }
    catch(error){
        console.log(token);
        res.status(401).json({
            msg:'Token no válido'
        })
    }
    
    

    

}

module.exports = {
    validarJWT
}