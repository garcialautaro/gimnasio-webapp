const   dbValidator = require('./db-validators'),
        generarJWT = require('./generarJWT'),
        subirArchivo = require('./subir-archivo'),
        generarContrasenia = require('./generar-contrasenia');

module.exports = {
    ...dbValidator,
    ...generarJWT,
    ...subirArchivo,
    ...generarContrasenia
}