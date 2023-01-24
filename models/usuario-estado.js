const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const UsuarioEstado = db.define('UsuarioEstado', 
    {
        Nombre: {
            type: DataTypes.STRING,
        },
        Vigencia: {
            type: DataTypes.BOOLEAN
        },
    });

module.exports = UsuarioEstado;