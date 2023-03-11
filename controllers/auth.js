const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req, res = response) =>{

    const { correo, password } = req.body;

    try{

        //verificar si el mail existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - correo'
            });
        }

        // si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - estado: false'
            });
        }
        //verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword)  {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - password'
            });
        }

        //genera el jwt 
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el admin'
        })
    }

   
}

const googleSignIn = async(req, res = response) => {
    
    console.log(req.body);
    const {id_token} = req.body;

    try{
        const { correo, nombre, img  } = await googleVerify( id_token );
        console.log(correo, nombre, img);
        let usuario = await Usuario.findOne({correo});
        console.log(usuario);
        if(!usuario){
            //tengo  que crearlo
            const data = {
                nombre,
                correo,
                rol: "VENTAS_ROLE",
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //si el usuario de BD 
        if( !usuario.estado )
        {
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);

    
        res.json({
            usuario,
            token
        });
    }
    catch(error)
    {
        res.status(400).json({
            msg: 'El Token no se pudo verificar'
        })
    }
    
}


module.exports = {
    login,
    googleSignIn
}