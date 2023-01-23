const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Alumno = db.define('Alumno', {
    AptoFisicoHasta: {
        type: DataTypes.DATE,
        default: DataTypes.NOW()
    },
    PersonaId: {
        type: DataTypes.INTEGER
    },
    UsuarioId: {
        type: DataTypes.INTEGER
    },
});

module.exports = Alumno;