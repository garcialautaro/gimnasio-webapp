const { Router } = require('express');
const { check } = require('express-validator');

const { ...alumno } = require('../controllers/');

const { validarJWT, validarCampos } = require('../middlewares');

const router = Router();

router.get('/', alumno.getAlumnos );

router.get('/:id', alumno.getAlumno );

router.post('/', alumno.postAlumno );

router.put('/:id', alumno.putAlumno );

router.put('/', alumno.requiereId);

router.delete('/:id', alumno.deleteAlumno );

router.delete('/', alumno.requiereId );

module.exports = router;