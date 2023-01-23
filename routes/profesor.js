const { Router } = require('express');

const { ...profesor } = require('../controllers/');

const router = Router();

router.get('/',       profesor.getProfesores );
router.get('/:id',    profesor.getProfesor );
router.post('/',      profesor.postProfesor );
router.put('/:id',    profesor.putProfesor );
router.delete('/:id', profesor.deleteProfesor );

module.exports = router;