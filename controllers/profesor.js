const { request, response } = require('express');
const { QueryTypes } = require('sequelize');
const { Profesor } = require('../models');


const getProfesores = async( req = request, res = response ) => {

    const profesores = await Profesor.sequelize.query(
        `SELECT Pr.Id, Pr.PreocupacionalHasta, Pr.Sueldo, Pr.Matricula, Pr.Estado, 
        P.Nombre, P.Apellido, P.FechaNac, P.DNI, P.Sexo, P.Observacion, P.Foto 
        From Profesor Pr INNER JOIN Persona P ON Pr.PersonaId = P.Id 
        WHERE Pr.Estado = 1`, 
        {
            type: QueryTypes.SELECT
        })
    res.json({ profesores });
}

const getProfesor = async( req = request, res = response ) => {

    const { id } = req.params;

    const profesor = await Profesor.sequelize.query(
        `SELECT Pr.Id, Pr.PreocupacionalHasta, Pr.Sueldo, Pr.Matricula, Pr.Estado, 
        P.Nombre, P.Apellido, P.FechaNac, P.DNI, P.Sexo, P.Observacion, P.Foto 
        From Profesor Pr INNER JOIN Persona P ON Pr.PersonaId = P.Id 
        WHERE Pr.Id = ${id}`, 
        {
            type: QueryTypes.SELECT
        })

    if( profesor.length === 1) {
        res.json(profesor);
    } else {
        res.status(404).json({
            msg: `No existe un profesor con el id ${ id }`
        });
    }


}

const postProfesor = async( req = request, res = response ) => {

    const { Estado, ...body } = req;

    try {

        const profesor = new Profesor(body);
        profesor.Estado = true;

        await profesor.save();

        res.json( profesor );


    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })    
    }



}

const putProfesor = async( req = request, res = response ) => {

    const { id }   = req.params;
    const { Estado, ...body } = req;

    try {
        
        const profesor = await Profesor.findByPk( id );
        if ( !profesor || profesor.Estado === false ) {
            return res.status(404).json({
                msg: 'No existe un profesor con el id ' + id
            });
        }

        await profesor.update( body );

        res.json( profesor );


    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })    
    }   
}


const deleteProfesor = async( req = request, res = response ) => {

    const { id } = req.params;

    const profesor = await Profesor.findByPk( id );
    if ( !profesor ) {
        return res.status(404).json({
            msg: 'No existe un profesor con el id ' + id
        });
    }

    profesor.Estado = false;
    profesor.save();

    //await profesor.destroy();


    res.json(profesor);
}

module.exports = {
    deleteProfesor,
    getProfesor,
    getProfesores,
    postProfesor,
    putProfesor,
}