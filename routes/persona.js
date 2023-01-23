const { Router } = require('express');

const { ...persona } = require('../controllers/');

const router = Router();

router.get('/',       persona.getPersonas );
router.get('/:id',    persona.getPersona );
router.post('/',      persona.postPersona );
router.put('/:id',    persona.putPersona );
router.delete('/:id', persona.deletePersona );

module.exports = router;