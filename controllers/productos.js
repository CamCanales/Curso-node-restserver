const { response } = require("express");
const { Producto} = require('../models');

//OBTENER CATEGORIAS - PAGINADO  - TOTAL - POPULATE
const obtenerProductos = async(req, res = response) =>{

    //----> DEVUELVE LAS CATEGORIAS PAGINADAS CON RANGOS DE INICIO (DESDE ) HASTA (LIMTE)
    const { limite = 5, desde = 0} = req.query; //-->ARGUMENTOS OPCIONALES DE LA URL
    const query = {estado: true}; //--> TRAE SOLO LOS QUE SON ESTADO TRUE

    //-> EJECUTA LAS 2 PROMESAS DE MANERA SIMULTANEA, PERO SI ALGUNA DA ERROR, TODAS DAN ERROR
    //-> SON POSICIONALES; SI LA 2dA PROMESA TERMINA PRIMERO SE ACCEDE MEDIANTE USUARIOS. LA PRIMERA PROMESA MEDIANTE TOTAL
    const [ total, productos]  = await Promise.all([ 
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total, 
        productos
    });
    
}


//OBTENER CATEGORIA - POPULATE {}
const obtenerProducto = async(req, res = response) =>{

    const { id } = req.params;
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');

    res.json (producto);

}


//PERMITE CREAR UNA NUEVA CATEGORIA 
const crearProducto = async(req, res = response) =>{

    const { estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB) {
        return res.status(400).json({
            msg:`El producto ${productoDB.nombre}, ya existe`
        });
    }

    //generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = await new Producto(data);

    //guardar DB
    await producto.save();

    res.status(201).json(producto);


}


//ACTUALIZAR CATEGORIA 
const actualizarProducto = async(req, res = response) =>{

    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }    
    data.usaurio = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true});
    res.json(producto);
}

//BORRAR CATEGORIA - CAMBIA ESTADO: FALSE
const borrarProducto = async(req, res = response) =>{
    
    const {id} = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true});

    res.json(productoBorrado);
}


module.exports ={
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}