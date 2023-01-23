const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { ...auth } = require('../controllers/');

const router =  Router();

router.post('/login', [
    check('Nombre', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('Contrasenia', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos   
] , auth.login);

module.exports = router;