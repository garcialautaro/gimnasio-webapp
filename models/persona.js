const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Persona = db.define('Persona', {
    Telefono: {
        type: DataTypes.STRING
    },
    Nombre: {
        type: DataTypes.STRING
    },
    Apellido: {
        type: DataTypes.STRING
    },
    FechaNac:{
        type: DataTypes.DATE
    },
    Dni:{
        type: DataTypes.STRING
    },
    Sexo:{
        type: DataTypes.CHAR
    },
    Observacion:{
        type: DataTypes.STRING
    },
    Foto:{
        type: DataTypes.BLOB
    },
});

module.exports = Persona;