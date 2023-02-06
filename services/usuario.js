const { Usuario } = require("../models");


const obtenerPorId = async(id) => {

    const usuario = await Usuario.findByPk(id)
    return usuario;
}

module.exports = {
    obtenerPorId,
}