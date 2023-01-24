const { Router } = require('express');
const { check } = require('express-validator');

const { ...persona } = require('../controllers/');
const { validarCampos, validarJWT } = require('../middlewares');

const router = Router();

router.get('/', persona.getPersonas );

router.get('/:id', [
    check('id', "No es un id válido").isNumeric(),
    validarCampos,
], persona.getPersona );

router.post('/', [
    validarJWT,
], persona.postPersona );

router.put('/:id', [
    validarJWT,
    check('id', "No es un id válido").isNumeric(),
    validarCampos,
] ,persona.putPersona );

router.delete('/:id', [
    validarJWT,
    check('id', "No es un id válido").isNumeric(),
    validarCampos,
] , persona.deletePersona );

module.exports = router;