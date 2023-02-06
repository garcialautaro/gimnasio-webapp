const { Plan } = require("../models");


const obtenerPorId = async(id) => {

    const plan = await Plan.findByPk(id)
    return plan;
}

module.exports = {
    obtenerPorId,
}