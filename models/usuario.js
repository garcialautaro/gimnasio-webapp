const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Usuario = db.define('Usuario', 
    {
        Nombre: {
            type: DataTypes.STRING,
            unique: true
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
        UsuarioEstadoId: {
            type: DataTypes.INTEGER
        },
    });
module.exports = Usuario;