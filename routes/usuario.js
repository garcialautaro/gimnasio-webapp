const { Router } = require('express');
const { check } = require('express-validator');

const { ...usuario } = require('../controllers/');
const { validarCampos, validarJWT } = require('../middlewares');

const router = Router();

router.get('/', usuario.getUsuarios );

router.get('/:id', [
    check('id', "No es un id válido").isNumeric(),
    validarCampos,
] ,usuario.getUsuario );

router.post('/', [
    validarJWT,
] ,usuario.postUsuario );

router.put('/:id', [
    validarJWT,
    check('id', "No es un id válido").isNumeric(),
    validarCampos,
] ,usuario.putUsuario );

router.put('/cambiar-contrasenia/:id', [
    validarJWT,
    check('id', "No es un id válido").isNumeric(),
    validarCampos,
] ,usuario.cambiarContrasenia );

router.put('/reestablecer-contrasenia/:id', [
    validarJWT,
    check('id', "No es un id válido").isNumeric(),
    validarCampos,
] ,usuario.reestablecerContrasenia );

router.delete('/:id', [
    validarJWT,
    check('id', "No es un id válido").isNumeric(),
    validarCampos,
] ,usuario.deleteUsuario );

module.exports = router;