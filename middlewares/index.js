const   validaCampos = require('../middlewares/validar-campos'),
        validaJWT = require('../middlewares/validar-jwt'),
        validaRoles = require('../middlewares/validar-roles'),
        validarUndefined = require('../middlewares/validar-archivo');

module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles,
    ...validarUndefined
}