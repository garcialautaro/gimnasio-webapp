const   dbValidator = require('./db-validators'),
        generarJWT = require('./generarJWT'),
        subirArchivo = require('./subir-archivo');

module.exports = {
    ...dbValidator,
    ...generarJWT,
    ...subirArchivo
}