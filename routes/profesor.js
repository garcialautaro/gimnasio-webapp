const { Router } = require('express');
const { check } = require('express-validator');

const { ...profesor } = require('../controllers/');
const { validarCampos, validarJWT } = require('../middlewares');

const router = Router();

router.get('/', profesor.getProfesores );

router.get('/:id', [
    check('id', "No es un id válido").isNumeric(),
    validarCampos,
] ,profesor.getProfesor );

router.post('/', [
    validarJWT,
] , profesor.postProfesor );

router.put('/:id', [
    validarJWT,
    check('id', "No es un id válido").isNumeric(),
    validarCampos,
] , profesor.putProfesor );

router.delete('/:id', [
    validarJWT,
    check('id', "No es un id válido").isNumeric(),
    validarCampos,
] ,profesor.deleteProfesor );

module.exports = router;