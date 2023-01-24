const { request, response } = require('express');
const { QueryTypes } = require('sequelize');
const { Alumno } = require('../models');


const getAlumnos = async( req = request, res = response ) => {

    // const alumno = await Alumno.findAll({
    //     where: { Estado: true}
    // });
    const alumnos = await Alumno.sequelize.query(
        `SELECT A.Id, A.AptoFisicoHasta, A.Estado, P.Nombre,
        P.Apellido, P.FechaNac, P.DNI, P.Sexo, P.Observacion, P.Foto 
        From Alumno A INNER JOIN Persona P ON A.PersonaId = P.Id 
        WHERE A.Estado = 1`, 
        {
            type: QueryTypes.SELECT
        })
    res.json({ alumnos });
}

const getAlumno = async( req = request, res = response ) => {

    const { id } = req.params;

    const alumno = await Alumno.sequelize.query(
        `SELECT A.Id, A.AptoFisicoHasta, A.Estado, P.Nombre,
        P.Apellido, P.FechaNac, P.DNI, P.Sexo, P.Observacion, P.Foto 
        From Alumno A INNER JOIN Persona P ON A.PersonaId = P.Id 
        WHERE A.Id = ${id}`, 
        {
            type: QueryTypes.SELECT
        })

    if( alumno.length === 1 ) {
        res.json(alumno);
    } else {
        res.status(404).json({
            msg: `No existe un alumno con el id ${ id }`
        });
    }


}

const postAlumno = async( req = request, res = response ) => {

    const { Estado, ...body } = req;

    try {

        const alumno = new Alumno(body);
        alumno.Estado = true;
        console.log(alumno);
        await alumno.save();

        res.json( alumno );


    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })    
    }



}

const putAlumno = async( req = request, res = response ) => {

    const { id }   = req.params;
    const { Estado, ...body } = req;

    try {
        
        const alumno = await Alumno.findByPk( id );
        console.log(alumno);
        if ( !alumno || alumno.Estado === false ) {
            return res.status(404).json({
                msg: 'No existe un alumno con el id ' + id
            });
        }

        await alumno.update( body );

        res.json( alumno );


    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })    
    }   
}


const deleteAlumno = async( req = request, res = response ) => {

    const { id } = req.params;

    const alumno = await Alumno.findByPk( id );
    if ( !alumno ) {
        return res.status(404).json({
            msg: 'No existe un alumno con el id ' + id
        });
    }
    alumno.Estado = false;
    alumno.save();

    //await alumno.destroy();
    
    res.json(alumno);
}

module.exports = {
    deleteAlumno,
    getAlumno,
    getAlumnos,
    postAlumno,
    putAlumno,
}