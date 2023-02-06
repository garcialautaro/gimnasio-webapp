const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const AlumnoPlan = db.define('AlumnoPlan', {
    Fecha: {
        type: DataTypes.DATE,
        default: DataTypes.NOW()
    },
    Activo: {
        type: DataTypes.BOOLEAN
    },
    AlumnoId: {
        type: DataTypes.INTEGER
    },
    PlanId: {
        type: DataTypes.INTEGER
    }
});

module.exports = AlumnoPlan;