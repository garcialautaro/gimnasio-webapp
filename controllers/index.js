const alumno = require('./alumno');
const auth = require('./auth');
const persona = require('./persona');
const profesor = require('./profesor');
const usuario = require('./usuario');

module.exports = {
    ...alumno,
    ...auth,
    ...persona,
    ...profesor,
    ...usuario,
}