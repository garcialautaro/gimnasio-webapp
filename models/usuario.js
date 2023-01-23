const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Usuario = db.define('Usuario', {
    Nombre: {
        type: DataTypes.STRING
    },
    Alias: {
        type: DataTypes.STRING
    },
    Contrasenia: {
        type: DataTypes.STRING
    },
    Email: {
        type: DataTypes.STRING
    },
});

module.exports = Usuario;