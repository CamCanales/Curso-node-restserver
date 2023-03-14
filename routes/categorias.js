const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria , borrarCategoria} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();


// Obtener todas las categorias - Publico
router.get('/', obtenerCategorias);

// Obtener una categorias por id  - Publico
router.get('/:id', [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId ),
    validarCampos,
], obtenerCategoria);

// CREAR categorias - privado - cualquier persona con token valido 
router.post('/', [ 
    validarJWT, 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos   
], crearCategoria);

// ACTUALIZAR UN REGISTRO POR ID -  Privado - cualquiera con token valido
router.put('/:id', [
    validarJWT, 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

// BORRAR UNA CATEGORIA - ADMIN
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos   
],borrarCategoria);


module.exports = router;