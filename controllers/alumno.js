const { request, response } = require('express');
const { Alumno } = require('../models/alumno');


const getAlumnos = async( req = request, res = response ) => {

    const alumno = await Alumno.findAll();

    res.json({ alumno });
}

const getAlumno = async( req = request, res = response ) => {

    const { id } = req.params;

    const alumno = await Alumno.findByPk( id );
    
    if( alumno ) {
        res.json(alumno);
    } else {
        res.status(404).json({
            msg: `No existe un alumno con el id ${ id }`
        });
    }


}

const postAlumno = async( req = request, res = response ) => {

    const { body } = req;

    try {

        const alumno = new Alumno(body);
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
    const { body } = req;

    try {
        
        const alumno = await Alumno.findByPk( id );
        if ( !alumno ) {
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

    await alumno.update({ estado: false });

    // await usuario.destroy();


    res.json(alumno);
}

module.exports = {
    deleteAlumno,
    getAlumno,
    getAlumnos,
    postAlumno,
    putAlumno,
}