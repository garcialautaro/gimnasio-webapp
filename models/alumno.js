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
    Estado: {
        type: DataTypes.BOOLEAN
    }
});

module.exports = Alumno;