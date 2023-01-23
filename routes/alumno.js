const { Router } = require('express');

const { ...alumno } = require('../controllers/');

const { validarJWT } = require('../middlewares');

const router = Router();

router.get('/', [] , alumno.getAlumnos );

router.get('/:id', alumno.getAlumno );
router.post('/', [ 
    validarJWT,
] , alumno.postAlumno );

router.put('/:id', [
    validarJWT,
] ,  alumno.putAlumno );

router.delete('/:id', [
    validarJWT,
] ,  alumno.deleteAlumno );

module.exports = router;