const   validaCampos = require('../middlewares/validar-campos'),
        validaJWT = require('../middlewares/validar-jwt'),
        validaRoles = require('../middlewares/validar-roles');

module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles,
}