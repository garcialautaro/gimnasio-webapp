const { request, response } = require('express');
const { alumnoExiste, validarAlumnoPlan } = require('../helpers/db-validators');
const { idIsNaN } = require('../helpers/validarParametro');
const { ...alumnoPlan } = require('../services/alumnoPlan');
const { obtenerPorId } = require('../services/plan');


const getAlumnosPlan = async( req = request, res = response ) => {

    try {

        const alumnoPlanDB = await alumnoPlan.obtenerTodos(req.query);
        if(alumnoPlanDB.length === 0) {
            return res.status(200).json({
                code: 410,
                msg: `No se encontraron planes de alumnos` });
        }
        res.status(200).json({ 
            code: 210,
            msg: `Planes de alumnos encontrados`,
            alumnoPlan: alumnoPlanDB });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            code: 500,
            msg: 'Hable con el administrador'
        })    

    }

}

const getAlumnoPlan = async( req = request, res = response ) => {

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
        const alumnoPlanDB = await alumnoPlan.obtenerPorId(id);
        console.log(alumnoPlanDB);
        if( alumnoPlanDB ) {
            res.status(200).json({
                code: 210,
                msg: `Plan de alumno encontrado`,
                alumnoPlan: alumnoPlanDB});
        } else {
            res.status(404).json({
                code: 410,
                msg: `No existe un plan de alumno con el id ${ id }`
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

const postAlumnoPlan = async( req = request, res = response ) => {

    const { Estado, Fecha, ...body } = req.body;

    const { AlumnoId = null, PlanId = null} = body;

    //#region  valido que los datos en el body sean correctos
    const msjParIsNaN = await idIsNaN ([
        { nombre: 'AlumnoId', valor: AlumnoId },
        { nombre: 'PlanId', valor: PlanId }
    ])
    if ( msjParIsNaN ) {
        return res.status(400).json({ 
            code: 400,
            msg: msjParIsNaN });
    }
    //#endregion

    //#region  Valido alumnos y planes
    const alumno = await alumnoExiste(AlumnoId);
    if (!alumno) {
        return res.status(400).json({ 
            code: 401,
            msg: `El alumno con id '${AlumnoId}' no existe` });
    }
    const plan = await obtenerPorId(PlanId)
    if(!plan) {
        return res.status(400).json({ 
            code: 411,
            msg: `El plan con id '${PlanId}' no existe` });
    }

    const alumnoPlanValidar = await validarAlumnoPlan(AlumnoId);
    console.log(alumnoPlanValidar);
    if(alumnoPlanValidar) {
        return res.status(400).json({ 
            code: 412,
            msg: `El alumno con id '${AlumnoId}' tiene asignado un plan activo` });
    }

    //#endregion

    try {
        const alumnoPlanDB = await alumnoPlan.crear(body)

        res.status(201).json({ 
            code: 211,
            msg: `Plan de alumno creado`,
            alumnoPlan: alumnoPlanDB });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            code: 500,
            msg: 'Hable con el administrador'
        })    
    }



}

const putAlumnoPlan = async( req = request, res = response ) => {

    const { id }   = req.params;
    const { AlumnoId, Estado, Fecha, ...body } = req.body;
    const { PlanId = null } = body;
    
    //#region valido que los datos en el body sean correctos
    const msjParIsNaN = await idIsNaN ([
        { nombre: 'PlanId', valor: PlanId },
        { nombre: 'id', valor: id }
    ])
    if ( msjParIsNaN ) {
        return res.status(400).json({ 
            code: 400,
            msg: msjParIsNaN });
    }
    //#endregion

    //valido que el id pertenezca a un alumnoPlan
    const alumnoPlanDB = await alumnoPlan.obtenerPorId(id);
    if (!alumnoPlanDB) {
        return res.status(400).json({ 
            code: 410, 
            msg: `El plan de alumno con id '${id}' no existe` });
    }

    //#region valido planes
    const plan = await obtenerPorId(PlanId)
    if(!plan) {
        return res.status(400).json({ 
            code: 411,
            msg: `El plan con id '${PlanId}' no existe` });
    }
    //#endregion

    try {
        const alumnoPlanActualizado = await alumnoPlan.actualizar(alumnoPlanDB, body);

        res.status(200).json({ 
            code: 212,
            msg: `Plan de alumno actualizado`,
            alumnoPlan: alumnoPlanActualizado });
    } catch (error) {

        console.log(error);
        res.status(500).json({
            code: 500,
            msg: 'Hable con el administrador'
        })    
    }   
}

const deleteAlumnoPlan = async( req = request, res = response ) => {

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

    //valido que el id pertenezca a un alumnoPlan
    const alumnoPlanDB = await alumnoPlan.obtenerPorId(id);
    if (!alumnoPlanDB) {
        return res.status(400).json({ 
            code: 410,
            msg: `El plan de alumno con id '${id}' no existe` });
    }

    const alumnoPlanDelete = await alumnoPlan.borrar(alumnoPlanDB);

    res.status(200).json({ 
        code: 213,
        msg: `Plan de alumno eliminado`,
        alumnoPlan: alumnoPlanDelete });
}

const requiereId = ( req = request, res = response ) => { 
    res.status(400).json({ 
        code: 400,
        msg: 'El metodo requiere un id'})
}

module.exports = {
    deleteAlumnoPlan,
    getAlumnoPlan,
    getAlumnosPlan,
    postAlumnoPlan,
    putAlumnoPlan,
    requiereId,
}