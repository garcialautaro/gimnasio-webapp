const { request, response } = require('express');
const { Profesor } = require('../models');


const getProfesores = async( req = request, res = response ) => {

    const profesor = await Profesor.findAll();

    res.json({ profesor });
}

const getProfesor = async( req = request, res = response ) => {

    const { id } = req.params;

    const profesor = await Profesor.findByPk( id );
    
    if( profesor ) {
        res.json(profesor);
    } else {
        res.status(404).json({
            msg: `No existe un profesor con el id ${ id }`
        });
    }


}

const postProfesor = async( req = request, res = response ) => {

    const { body } = req;

    try {

        const profesor = new Profesor(body);
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
    const { body } = req;

    try {
        
        const profesor = await Profesor.findByPk( id );
        if ( !profesor ) {
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

    await profesor.destroy();

    // await usuario.destroy();


    res.json(profesor);
}

module.exports = {
    deleteProfesor,
    getProfesor,
    getProfesores,
    postProfesor,
    putProfesor,
}