const { Router } = require('express');

const { ...alumnoPlan } = require('../controllers/');

const router = Router();

router.get('/', alumnoPlan.getAlumnosPlan );

router.get('/:id', alumnoPlan.getAlumnoPlan );

router.post('/', alumnoPlan.postAlumnoPlan );

router.put('/:id', alumnoPlan.putAlumnoPlan );

router.put('/', alumnoPlan.requiereId );

router.delete('/:id', alumnoPlan.deleteAlumnoPlan );

router.delete('/', alumnoPlan.requiereId );

module.exports = router;