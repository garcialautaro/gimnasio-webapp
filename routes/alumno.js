const { Router } = require('express');

const { getAlumnos, 
        getAlumno, 
        postAlumno, 
        putAlumno, 
        deleteAlumno } = require('../controllers/alumno');

const router = Router();

router.get('/',       getAlumnos );
router.get('/:id',    getAlumno );
router.post('/',      postAlumno );
router.put('/:id',    putAlumno );
router.delete('/:id', deleteAlumno );

module.exports = router;