const { QueryTypes } = require("sequelize");
const { Persona } = require("../models");


const obtenerTodos = async(query) =>{
    const {Telefono, Nombre, Apellido, FechaNac, Dni, Sexo, Observacion, Id} = query
    let personas = null;
    Telefono ?
    personas = await Persona.findAll( { where: { Telefono } })
    : personas = Nombre ? await Persona.findAll( { where: { Nombre } })
    : personas = Apellido ? await Persona.findAll( { where: { Apellido } })
    : personas = FechaNac ? await Persona.findAll( { where: { FechaNac } })
    : personas = Dni ? await Persona.findAll( { where: { Dni } })
    : personas = Sexo ? await Persona.findAll( { where: { Sexo } })
    : personas = Observacion ? await Persona.sequelize.query(
        `SELECT P.Id, P.Nombre, P.Apellido, P.FechaNac, P.Dni, P.Sexo, P.Observacion, P.Foto 
        From Persona P WHERE P.Observacion LIKE :observacion`, 
        {
            type: QueryTypes.SELECT,
            replacements: { observacion: `%${Observacion}%` }
        })
    : Id ? personas = await Persona.findByPk(Id)
    : personas = Persona.findAll();
    console.log(personas);
    return personas;
}

const obtenerPorId = async(id) => {

    const persona = await Persona.findByPk(id)
    return persona;
}

const crear = async(body) => {
    const persona = new Persona(body);
    await persona.save();

    return persona;
}

const actualizar = async (persona, body) => {

    await persona.update( body );
    
    return persona;
}

const borrar = async(persona) => {
    await persona.destroy();

    return;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    borrar,
}