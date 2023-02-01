const { request, response } = require('express');
const { alumnoExiste } = require('../helpers/db-validators');
const { ...alumno } = require('../services/alumno');


const getAlumnos = async( req = request, res = response ) => {

    const alumnosDB = await alumno.obtenerTodos();

    res.status(200).json({ alumnosDB });

}

const getAlumno = async( req = request, res = response ) => {

    const { id } = req.params;

    const alumnoDB = await alumno.obtenerPorId(id);

    if( alumnoDB.length === 1 ) {
        res.status(200).json(alumnoDB);
    } else {
        res.status(404).json({
            msg: `No existe un alumno con el id ${ id }`
        });
    }


}

const postAlumno = async( req = request, res = response ) => {

    const { Estado, ...body } = req.body;

    try {
        const alumnoDB = await alumno.crear(body)

        res.status(201).json( alumnoDB );

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

    //valido que el id pertenezca a un usuario
    const msj = await alumnoExiste(id)
    if (msj) {
        return res.status(400).json( msj );
    }
    try {
        const alumnoDB = await alumno.actualizar(id, body);
        res.status(200).json( alumnoDB );
    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })    
    }   
}


const deleteAlumno = async( req = request, res = response ) => {

    const { id } = req.params;

    const alumnoDB = await alumno.borrar(id);
    
    res.status(200).json(alumnoDB);
}

module.exports = {
    deleteAlumno,
    getAlumno,
    getAlumnos,
    postAlumno,
    putAlumno,
}