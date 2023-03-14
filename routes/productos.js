const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProducto, obtenerProductos, actualizarProducto , borrarProducto} =  require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();


// Obtener todas las categorias - Publico
router.get('/', obtenerProductos);

// Obtener una categorias por id  - Publico
router.get('/:id', [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId ),
    validarCampos,
], obtenerProducto);

// CREAR categorias - privado - cualquier persona con token valido 
router.post('/', [ 
    validarJWT, 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un Id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos   
], crearProducto);

// ACTUALIZAR UN REGISTRO POR ID -  Privado - cualquiera con token valido
router.put('/:id', [
    validarJWT, 
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

// BORRAR UNA CATEGORIA - ADMIN
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos   
],borrarProducto);


module.exports = router;