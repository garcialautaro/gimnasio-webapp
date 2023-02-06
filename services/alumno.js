const { QueryTypes } = require("sequelize");
const { Alumno } = require("../models");


const obtenerTodos = async(query) =>{
    const {Activo, AptoFisicoHasta, PersonaId, UsuarioId, Id} = query
    let alumnos = null;
    Activo? 
    
    alumnos = await Alumno.sequelize.query(
        `SELECT A.Id, A.AptoFisicoHasta, A.Activo, P.Nombre, P.Apellido, P.FechaNac, P.DNI, P.Sexo, P.Observacion, P.Foto 
        From Alumno A INNER JOIN Persona P ON A.PersonaId = P.Id WHERE A.Activo = :activo`, 
        {
            type: QueryTypes.SELECT,
            replacements: { activo: Activo }
        })
    : AptoFisicoHasta ? 
    alumnos = await Alumno.sequelize.query(
        `SELECT A.Id, A.AptoFisicoHasta, A.Activo, P.Nombre, P.Apellido, P.FechaNac, P.DNI, P.Sexo, P.Observacion, P.Foto 
        From Alumno A INNER JOIN Persona P ON A.PersonaId = P.Id WHERE A.AptoFisicoHasta = :aptoFisicoHasta`, 
        {
            type: QueryTypes.SELECT,
            replacements: { aptoFisicoHasta: AptoFisicoHasta }
        })
    : PersonaId ? 
    alumnos = await Alumno.sequelize.query(
        `SELECT A.Id, A.AptoFisicoHasta, A.Activo, P.Nombre, P.Apellido, P.FechaNac, P.DNI, P.Sexo, P.Observacion, P.Foto 
        From Alumno A INNER JOIN Persona P ON A.PersonaId = P.Id WHERE A.PersonaId = :personaId`, 
        {
            type: QueryTypes.SELECT,
            replacements: { personaId: PersonaId }
        })
    : UsuarioId ? 
    alumnos = await Alumno.sequelize.query(
        `SELECT A.Id, A.AptoFisicoHasta, A.Activo, P.Nombre, P.Apellido, P.FechaNac, P.DNI, P.Sexo, P.Observacion, P.Foto 
        From Alumno A INNER JOIN Persona P ON A.PersonaId = P.Id WHERE A.UsuarioId = :usuarioId`, 
        {
            type: QueryTypes.SELECT,
            replacements: { usuarioId: UsuarioId }
        })
    : Id? 
    alumnos = await Alumno.sequelize.query(
        `SELECT A.Id, A.AptoFisicoHasta, A.Activo, P.Nombre, P.Apellido, P.FechaNac, P.DNI, P.Sexo, P.Observacion, P.Foto 
        From Alumno A INNER JOIN Persona P ON A.PersonaId = P.Id WHERE A.Id = :id`, 
        {
            type: QueryTypes.SELECT,
            replacements: { id: Id }
        })
    : alumnos = await Alumno.sequelize.query(
        `SELECT A.Id, A.AptoFisicoHasta, A.Activo, P.Nombre, P.Apellido, P.FechaNac, P.DNI, P.Sexo, P.Observacion, P.Foto 
        From Alumno A INNER JOIN Persona P ON A.PersonaId = P.Id`, 
        {
            type: QueryTypes.SELECT
        })
    return alumnos;
}

const obtenerPorId = async(id) => {

    return await Alumno.sequelize.query(
        `SELECT A.Id, A.AptoFisicoHasta, A.Activo, P.Nombre,
        P.Apellido, P.FechaNac, P.DNI, P.Sexo, P.Observacion, P.Foto 
        From Alumno A INNER JOIN Persona P ON A.PersonaId = P.Id 
        WHERE A.Id = ${id}`, 
        {
            type: QueryTypes.SELECT
        })
}

const crear = async(body) => {
    const alumno = new Alumno(body);
    alumno.Activo = true;

    await alumno.save();

    return alumno;
}

const actualizar = async (alumnoDB, body) => {

    await alumnoDB.update( body );

    return alumnoDB;
}

const borrar = async(alumno) => {
    
    alumno.Activo = false;
    alumno.save();

    //await alumno.destroy();

    return alumno;
}
module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    borrar,
}