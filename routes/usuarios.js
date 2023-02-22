const {Router} = require('express');
const {usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete } = require('../controllers/usuarios');

const router = Router();


router.get('/',  usuariosGet);

// router.get('/', (req, res) => {
//     res.json({
//         msg:'get API'
//     })
// });

router.put('/:id', usuariosPut );

router.post('/', usuariosPost);

router.delete('/', usuariosPatch);

router.patch('/', usuariosDelete);

module.exports = router;
