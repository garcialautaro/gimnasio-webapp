const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Plan = db.define('Plan', {
    DiasSemana: {
        type: DataTypes.SMALLINT
    },
    Estado: {
        type: DataTypes.BOOLEAN
    },
    PlanTipoId: {
        type: DataTypes.INTEGER
    },
    RutinaId: {
        type: DataTypes.INTEGER
    }
});

module.exports = Plan;