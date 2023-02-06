const { request, response } = require('express');
const { alumnoExiste, 
        validarAlumnoUsuario, 
        validarAlumnoPersona } = require('../helpers/db-validators');

const { idIsNaN, parameterIsDate } = require('../helpers/validarParametro');
const { ...alumno } = require('../services/alumno');

const { obtenerPorId: obtenerPersona  } = require('../services/persona');
const { obtenerPorId: obtenerUsuario  } = require('../services/usuario');


const getAlumnos = async( req = request, res = response ) => {
    try {
        const alumnosDB = await alumno.obtenerTodos(req.query);
        if(alumnosDB.length === 0) {
            return res.status(200).json({
                code: 401,
                msg: `No se encontraron alumnos` });
        }
        res.status(200).json({
            code: 200,
            msg: `Alumno/s encontrado/s`,
            alumnos: alumnosDB });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            msg: 'Hable con el administrador'
        })    
    }

}

const getAlumno = async( req = request, res = response ) => {
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
        const alumnoDB = await alumno.obtenerPorId(id);
        console.log(alumnoDB);
        // valido que se encuentre un alumno
        if( alumnoDB.length === 1 ) {
            res.status(200).json({
                code: 200,
                msg: `Alumno encontrado`,
                alumno: alumnoDB });
        } else {
            res.status(404).json({ 
                code: 401,
                msg: `No existe un alumno con id ${ id }` 
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

const postAlumno = async( req = request, res = response ) => {

    const { Activo, ...body } = req.body;

    const { PersonaId = null, UsuarioId = null, AptoFisicoHasta = null} = body;

    //#region  valido que los datos en el body sean correctos
    const msjParIsNaN = await idIsNaN ([
        { nombre: 'PersonaId', valor: PersonaId },
        { nombre: 'UsuarioId', valor: UsuarioId }
    ])
    const msjParIsDate = await parameterIsDate ([
        { nombre: 'AptoFisicoHasta', valor: AptoFisicoHasta }
    ])
    if ( msjParIsNaN || msjParIsDate ) {
        return res.status(400).json({
            code: 400,
            msg: msjParIsNaN || msjParIsDate});
    }
    //#endregion

    //#region  Valido personas y usuarios
    const persona = await obtenerPersona( PersonaId );
    if (!persona) {
        return res.status(400).json({ 
            code: 402,
            msg: `La persona con id '${ PersonaId }' no existe` });
    }
    const alumnoPersona = await validarAlumnoPersona( PersonaId );
    if(alumnoPersona) {
        return res.status(400).json( {
            code: 405,
            msg: `La persona con id '${ PersonaId }' ya esta asignada a un alumno`
        }); 
    }

    const usuario = await obtenerUsuario(UsuarioId)
    if(!usuario) {
        return res.status(400).json( {
            code: 403,
            msg: `El usuario con id '${UsuarioId}' no existe`
        }); 
    }

    const alumnoUsuario = await validarAlumnoUsuario( UsuarioId );
    if(alumnoUsuario) {
        return res.status(400).json( {
            code: 404,
            msg: `El usuario con id '${UsuarioId}' ya esta asignado a un alumno`
        }); 
    }
    //#endregion

    try {
        const alumnoDB = await alumno.crear(body)

        res.status(201).json({
            code: 201,
            msg: `Alumno creado`,
            alumno: alumnoDB });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            code: 500,
            msg: 'Hable con el administrador'
        })    
    }



}

const putAlumno = async( req = request, res = response ) => {

    const { id }   = req.params;
    const { Activo, ...body } = req.body;
    const { PersonaId = null, UsuarioId = null, AptoFisicoHasta = null} = body;

    //#region  valido que los datos en el body y param sean correctos
    const msjParIsNaN = await idIsNaN([
        { nombre: 'id', valor: id },
        { nombre: 'PersonaId', valor: PersonaId },
        { nombre: 'UsuarioId', valor: UsuarioId }
    ])
    const msjParIsDate = await parameterIsDate ([
        { nombre: 'AptoFisicoHasta', valor: AptoFisicoHasta }
    ])
    if ( msjParIsNaN || msjParIsDate ) {
        return res.status(400).json({ 
            code: 400,
            msg: msjParIsNaN || msjParIsDate });
    }
    //#endregion

    //valido que el id pertenezca a un alumno
    const alumnoDB = await alumnoExiste(id);
    if (!alumnoDB) {
        return res.status(400).json({ 
            code: 401,
            msg: `El alumno con id '${id}' no existe` });
    }

    //#region  Valido personas y usuarios
    const persona = await obtenerPersona( PersonaId );
    if (!persona) {
        return res.status(400).json({ 
            code: 402,
            msg: `La persona con id '${ PersonaId }' no existe` });
    }
    if (!(PersonaId === alumnoDB.PersonaId)) {
        const alumnoPersona = await validarAlumnoPersona( PersonaId );
        if(alumnoPersona) {
            return res.status(400).json( {
                code: 405,
                msg: `La persona con id '${ PersonaId }' ya esta asignada a un alumno`
            }); 
        }
    }
    const usuario = await obtenerUsuario(UsuarioId)
    if(!usuario) {
        return res.status(400).json( {
            code: 403,
            msg: `El usuario con id '${UsuarioId}' no existe`
        }); 
    }

    if (!(UsuarioId === alumnoDB.UsuarioId)) {
        const alumnoUsuario = await validarAlumnoUsuario( UsuarioId );
        if(alumnoUsuario) {
            return res.status(400).json( {
                code: 404,
                msg: `El usuario con id '${UsuarioId}' ya esta asignado a un alumno`
            }); 
        }
    }
    //#endregion

    try {
        const alumnoActualizado = await alumno.actualizar(alumnoDB, body);

        res.status(200).json({ 
            code: 202,
            alumno: alumnoActualizado });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            msg: 'Hable con el administrador'
        })    
    }   
}

const deleteAlumno = async( req = request, res = response ) => {

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

    //valido que el id sea de un alumno
    const alumnoDB = await alumnoExiste(id)
    if(!alumnoDB) {
        return res.status(400).json({ 
            code: 401,
            msg: `El alumno con id '${id}' no existe` });
    }

    try {
        const alumnoDelete = await alumno.borrar(alumnoDB);

        res.status(200).json({ 
            code: 203,
            msg: `Alumno borrado`,
            alumno: alumnoDelete });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            msg: 'Hable con el administrador'
        })    
    }
}

const requiereId = ( req = request, res = response ) => { 
    res.status(400).json({ 
        code: 400, 
        msg: 'El metodo requiere un id'})
}

module.exports = {
    deleteAlumno,
    getAlumno,
    getAlumnos,
    postAlumno,
    putAlumno,
    requiereId,
}