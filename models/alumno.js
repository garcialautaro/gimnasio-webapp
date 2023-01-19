const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Alumno = db.define('Alumno', {
    AptoFisicoHasta: {
        type: DataTypes.DATE
    },
    PersonaId: {
        type: DataTypes.INTEGER
    },
    UsuarioId: {
        type: DataTypes.INTEGER
    },
},{plural: 'Alumno'});

module.exports = {
    Alumno
}