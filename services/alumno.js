const { QueryTypes } = require("sequelize");
const { alumnoExiste } = require("../helpers/db-validators");
const { Alumno } = require("../models")


const obtenerTodos = async() =>{
    const alumnos = await Alumno.sequelize.query(
        `SELECT A.Id, A.AptoFisicoHasta, A.Estado, P.Nombre,
        P.Apellido, P.FechaNac, P.DNI, P.Sexo, P.Observacion, P.Foto 
        From Alumno A INNER JOIN Persona P ON A.PersonaId = P.Id 
        WHERE A.Estado = 1`, 
        {
            type: QueryTypes.SELECT 
        })
    return alumnos;
}

const obtenerPorId = async(id) => {

    const alumno = await Alumno.sequelize.query(
        `SELECT A.Id, A.AptoFisicoHasta, A.Estado, P.Nombre,
        P.Apellido, P.FechaNac, P.DNI, P.Sexo, P.Observacion, P.Foto 
        From Alumno A INNER JOIN Persona P ON A.PersonaId = P.Id 
        WHERE A.Id = ${id}`, 
        {
            type: QueryTypes.SELECT
        })
    return alumno;
}

const crear = async(body) => {
    const alumno = new Alumno(body);
    alumno.Estado = true;
    console.log(alumno);
    await alumno.save();

    return alumno;
}

const actualizar = async (id, body) => {
    const alumno = await Alumno.findByPk( id );
    console.log(body.body);
    
    await alumno.update( body );

    return alumno;
}

const borrar = async(id) => {
    const alumno = await Alumno.findByPk( id );
    if ( !alumno ) {
        return res.status(404).json({
            msg: 'No existe un alumno con el id ' + id
        });
    }
    alumno.Estado = false;
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