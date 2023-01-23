const { Router } = require('express');

const { ...usuario } = require('../controllers/');

const router = Router();

router.get('/',       usuario.getUsuarios );
router.get('/:id',    usuario.getUsuario );
router.post('/',      usuario.postUsuario );
router.put('/:id',    usuario.putUsuario );
router.delete('/:id', usuario.deleteUsuario );

module.exports = router;