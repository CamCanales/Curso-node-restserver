const { response } = require("express");
const { Categoria} = require('../models');

//OBTENER CATEGORIAS - PAGINADO  - TOTAL - POPULATE
const obtenerCategorias = async(req, res = response) =>{

    //----> DEVUELVE LAS CATEGORIAS PAGINADAS CON RANGOS DE INICIO (DESDE ) HASTA (LIMTE)
    const { limite = 5, desde = 0} = req.query; //-->ARGUMENTOS OPCIONALES DE LA URL
    const query = {estado: true}; //--> TRAE SOLO LOS QUE SON ESTADO TRUE

    //-> EJECUTA LAS 2 PROMESAS DE MANERA SIMULTANEA, PERO SI ALGUNA DA ERROR, TODAS DAN ERROR
    //-> SON POSICIONALES; SI LA 2dA PROMESA TERMINA PRIMERO SE ACCEDE MEDIANTE USUARIOS. LA PRIMERA PROMESA MEDIANTE TOTAL
    const [ total, categorias]  = await Promise.all([ 
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total, 
        categorias
    });
    
}


//OBTENER CATEGORIA - POPULATE {}
const obtenerCategoria = async(req, res = response) =>{

    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');

    res.json (categoria);

}


//PERMITE CREAR UNA NUEVA CATEGORIA 
const crearCategoria = async(req, res = response) =>{

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB) {
        return res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    //generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await new Categoria(data);

    //guardar DB
    await categoria.save();

    res.status(201).json(categoria);


}


//ACTUALIZAR CATEGORIA 
const actualizarCategoria = async(req, res = response) =>{

    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usaurio = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true});
    res.json(categoria);

}

//BORRAR CATEGORIA - CAMBIA ESTADO: FALSE
const borrarCategoria = async(req, res = response) =>{
    
    const {id} = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado:false}, {new:true});

    res.json(categoriaBorrada);
}


module.exports ={
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    borrarCategoria
}