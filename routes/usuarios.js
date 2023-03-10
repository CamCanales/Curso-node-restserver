const {Router} = require('express');
const { check } = require('express-validator');
const {validarCampos } = require('../middlewares/validar-campos');
const {usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete } = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators'); //--> VALIDACIONES BD


const router = Router();


router.get('/',  usuariosGet);

// router.get('/', (req, res) => {
//     res.json({
//         msg:'get API'
//     })
// });

//----> VALIDA CAMPOS CON METODO CHECK
//----> SI ESTA CORRECTO PASA AL VALIDA CAMPOS; DE ESTA FORMA SE ANTICIPA AL USUARIOS PUT
router.put('/:id', [ 
    check('id','No es un ID Válido').isMongoId(),
    check('id').custom( existeUsuarioPorId),
    check('rol').custom(esRoleValido), 
    validarCampos
], usuariosPut );

//--->  POST  
router.post('/', [
    //--->  CHECK ES UN MIDDLEWARE DE EXPRESS (VALIDA UN CAMPO COMO EMAIL)
    check('nombre','El nombre es obligatorio').not().isEmpty(), 
    check('password','El password es obligatorio y debe contener mas de 6 letras').isLength({ min: 6 }),
    //check('correo','El correo no es válido').isEmail(), 
    check('correo').custom( emailExiste ), 
    //check('rol','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRoleValido), 
    validarCampos
], usuariosPost);

//--->  DELETE 
//router.delete('/:id', usuariosDelete );   //---->ORIGINAL 
router.delete('/:id', [
    check('id','No es un ID Válido').isMongoId(),
    check('id').custom( existeUsuarioPorId),
    validarCampos
], usuariosDelete );//---->LE PASA UN ARREGLO DE VALIDACION ANTES DE EJECUTAR EL DELETE 




router.patch('/', usuariosPatch);

module.exports = router;
