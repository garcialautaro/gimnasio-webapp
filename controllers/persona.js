const { request, response } = require('express');
const { idIsNaN, parameterIsNotNull, parameterIsDate, parameterIsValidGenre } = require('../helpers/validarParametro');
const { ...persona } = require('../services/persona');

const getPersonas = async( req = request, res = response ) => {

    try {

        const personaDB = await persona.obtenerTodos(req.query);
        if(personaDB.length === 0) {
            return res.status(200).json({
                code: 402,
                msg: `No se encontraron personas` });
        }
        res.status(200).json({ 
            code: 220,
            msg: `Personas encontradas`,
            persona: personaDB });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            code: 500,
            msg: 'Hable con el administrador'
        })    

    }
}

const getPersona = async( req = request, res = response ) => {

    const { id } = req.params;

    // valido que el id sea un número
    const msjIdIsNaN = await idIsNaN([
            { nombre: 'id', valor: id }
        ])
    if(msjIdIsNaN) {
        return res.status(400).json({ 
            code: 400, 
            msg: msjIdIsNaN })
    }

    try {
        // llamo al servicio que busca el alumno
        const personaDB = await persona.obtenerPorId(id)
        
        if( personaDB ) {
            
            res.status(200).json({
                code: 220,
                msg: `Persona encontrada`, 
                persona: personaDB });
        } else {
            res.status(404).json({
                code: 402,
                msg: `No existe un persona con id '${ id }'`
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            msg: 'Hable con el administrador'
        })    
    }
}

const postPersona = async( req = request, res = response ) => {

    const { body } = req;

    //#region  valido que los datos en el body sean correctos
    const { Nombre = null, Apellido = null, FechaNac = null,
        Dni = null, Sexo} = body;

    const msjParIsNull = await parameterIsNotNull ([
        { nombre: 'Nombre', valor: Nombre, length: 30 },
        { nombre: 'Apellido', valor: Apellido, length: 30 },
        { nombre: 'Dni', valor: Dni, length: 15 }
    ])
    const msjParIsNotDate = await parameterIsDate ([
        { nombre: 'FechaNac', valor: FechaNac }
    ])
    const msjParIsNotValidGenre = await parameterIsValidGenre ([
        { nombre: 'Sexo', valor: Sexo }
    ])

    if ( msjParIsNull || msjParIsNotDate || msjParIsNotValidGenre) {
        return res.status(400).json({
            code: 400,
            msg: msjParIsNull || msjParIsNotDate || msjParIsNotValidGenre });
    }
    //#endregion

    try {
        const personaDB = await persona.crear(body);

        res.status(201).json({ 
            code: 221,
            msg: `Persona creada`,
            persona: personaDB });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            msg: 'Hable con el administrador'
        })    
    }
}

const putPersona = async( req = request, res = response ) => {

    const { id }   = req.params;
    const { body } = req;
    
    //#region  valido que los datos en el body sean correctos
    const { Nombre = null, Apellido = null, FechaNac = null,
        Dni = null, Sexo} = body;

    const msjIdIsNaN = await idIsNaN([
        { nombre: 'id', valor: id }
    ])
    const msjParIsNull = await parameterIsNotNull ([
        { nombre: 'Nombre', valor: Nombre },
        { nombre: 'Apellido', valor: Apellido },
        { nombre: 'Dni', valor: Dni }
    ])
    const msjParIsNotDate = await parameterIsDate ([
        { nombre: 'FechaNac', valor: FechaNac }
    ])
    const msjParIsNotValidGenre = await parameterIsValidGenre ([
        { nombre: 'Sexo', valor: Sexo }
    ])

    if ( msjIdIsNaN || msjParIsNull || msjParIsNotDate || msjParIsNotValidGenre) {
        return res.status(400).json({
            code: 400,
            msg: msjIdIsNaN || msjParIsNull || msjParIsNotDate || msjParIsNotValidGenre });
    }
    //#endregion

    try {
        
        const personaDB = await persona.obtenerPorId(id);
        if ( !personaDB ) {
            return res.status(404).json({
                code: 402,
                msg: `No existe un persona con id '${id}'`
            });
        }

        const personaActualizada = await persona.actualizar(personaDB, body);

        res.status(200).json({ 
            code: 222,
            msg: `Persona actualizada.`,
            persona: personaActualizada });


    } catch (error) {

        console.log(error);
        res.status(500).json({
            code: 500,
            msg: 'Hable con el administrador'
        })    
    }   
}

const deletePersona = async( req = request, res = response ) => {

    const { id } = req.params;

    const msjIdIsNaN = await idIsNaN([
        { nombre: 'id', valor: id }
    ])
    if(msjIdIsNaN) {
        return res.status(400).json({ 
            code: 400,
            msg: msjIdIsNaN })
    }

    const personaDB = await persona.obtenerPorId(id);
    if ( !personaDB ) {
        return res.status(404).json({
            code: 402,
            msg: `No existe un persona con id '${id}'`
        });
    }

    await persona.borrar(personaDB);

    res.status(200).json({
        code: 223,
        msj: `Borrado fisico de persona con id: '${id}'`,
        persona: personaDB});
}

const requiereId = ( req = request, res = response ) => { 
    res.status(400).json({ 
        code: 400,
        msg: 'El metodo requiere un id'})
}

module.exports = {
    deletePersona,
    getPersona,
    getPersonas,
    postPersona,
    putPersona,
    requiereId,
}