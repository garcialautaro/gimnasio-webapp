const   dbValidator = require('./db-validators'),
        generarJWT = require('./generarJWT'),
        generarContrasenia = require('./generar-contrasenia');

module.exports = {
    ...dbValidator,
    ...generarJWT,
    ...generarContrasenia
}