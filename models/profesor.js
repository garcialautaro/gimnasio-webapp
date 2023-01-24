const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Profesor = db.define('Profesor', {
    PreocupacionalHasta: {
        type: DataTypes.DATE
    },
    Sueldo: {
        type: DataTypes.DECIMAL
    },
    Matricula: {
        type: DataTypes.STRING
    },
    PersonaId:{
        type: DataTypes.INTEGER
    },
    UsuarioId:{
        type: DataTypes.INTEGER
    },
    Estado: {
        type: DataTypes.BOOLEAN
    }
});
module.exports = Profesor;