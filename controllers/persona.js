const { request, response } = require('express');
const { Persona } = require('../models');


const getPersonas = async( req = request, res = response ) => {

    const persona = await Persona.findAll();

    res.json({ persona });
}

const getPersona = async( req = request, res = response ) => {

    const { id } = req.params;

    const persona = await Persona.findByPk( id );
    
    if( persona ) {
        res.json(persona);
    } else {
        res.status(404).json({
            msg: `No existe un persona con el id ${ id }`
        });
    }


}

const postPersona = async( req = request, res = response ) => {

    const { body } = req;

    try {

        const persona = new Persona(body);
        await persona.save();

        res.json( persona );


    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })    
    }



}

const putPersona = async( req = request, res = response ) => {

    const { id }   = req.params;
    const { body } = req;

    try {
        
        const persona = await Persona.findByPk( id );
        if ( !persona ) {
            return res.status(404).json({
                msg: 'No existe un persona con el id ' + id
            });
        }

        await persona.update( body );

        res.json( persona );


    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })    
    }   
}


const deletePersona = async( req = request, res = response ) => {

    const { id } = req.params;

    const persona = await Persona.findByPk( id );
    if ( !persona ) {
        return res.status(404).json({
            msg: 'No existe un persona con el id ' + id
        });
    }

    await persona.destroy();

    // await usuario.destroy();


    res.json(persona);
}

module.exports = {
    deletePersona,
    getPersona,
    getPersonas,
    postPersona,
    putPersona,
}