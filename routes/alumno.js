const { Router } = require('express');
const { check } = require('express-validator');

const { ...alumno } = require('../controllers/');

const { validarJWT, validarCampos } = require('../middlewares');

const router = Router();

router.get('/', [] , alumno.getAlumnos );

router.get('/:id', [
    check('id', "No es un id válido").isNumeric(),
    validarCampos,
] ,alumno.getAlumno );

router.post('/', [ 
    validarJWT,
] , alumno.postAlumno );

router.put('/:id', [
    validarJWT,
    check('id', "No es un id válido").isNumeric(),
    validarCampos,
] ,  alumno.putAlumno );

router.delete('/:id', [
    validarJWT,
    check('id', "No es un id válido").isNumeric(),
    validarCampos,
] ,  alumno.deleteAlumno );

module.exports = router;