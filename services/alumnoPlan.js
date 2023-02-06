const { QueryTypes } = require("sequelize");
const { AlumnoPlan } = require("../models");


const obtenerTodos = async(query) =>{
    const {AlumnoId, PlanId, Activo, Fecha, Id} = query
    let alumnosPlan = null;
    AlumnoId ?  
    alumnosPlan = await AlumnoPlan.sequelize.query(
        `SELECT Ap.Id, Ap.Fecha, Ap.Activo, Ap.AlumnoId, Ap.PlanId
        From AlumnoPlan Ap WHERE Ap.AlumnoId = :alumnoId`, 
        {
            type: QueryTypes.SELECT,
            replacements: {
                alumnoId: AlumnoId
            }
        })
    : PlanId ?
    alumnosPlan = await AlumnoPlan.sequelize.query(
        `SELECT Ap.Id, Ap.Fecha, Ap.Activo, Ap.AlumnoId, Ap.PlanId
        From AlumnoPlan Ap WHERE Ap.PlanId = :planId`, 
        {
            type: QueryTypes.SELECT,
            replacements: { planId: PlanId }
        })
    : Activo ? 
    alumnosPlan = await AlumnoPlan.sequelize.query(
        `SELECT Ap.Id, Ap.Fecha, Ap.Activo, Ap.AlumnoId, Ap.PlanId
        From AlumnoPlan Ap WHERE Ap.Activo = :activo`, 
        {
            type: QueryTypes.SELECT,
            replacements: { activo: Activo }
        })
    : Fecha ? 
    alumnosPlan = await AlumnoPlan.sequelize.query(
        `SELECT Ap.Id, Ap.Fecha, Ap.Activo, Ap.AlumnoId, Ap.PlanId
        From AlumnoPlan Ap WHERE Ap.Fecha = :fecha`, 
        {
            type: QueryTypes.SELECT,
            replacements: { fecha: Fecha }
        })
    : Id ? 
    alumnosPlan = await AlumnoPlan.sequelize.query(
        `SELECT Ap.Id, Ap.Fecha, Ap.Activo, Ap.AlumnoId, Ap.PlanId
        From AlumnoPlan Ap WHERE Ap.Id = :id`, 
        {
            type: QueryTypes.SELECT,
            replacements: { id: Id }
        })
    : alumnosPlan = await AlumnoPlan.sequelize.query(
        `SELECT Ap.Id, Ap.Fecha, Ap.Activo, Ap.AlumnoId, Ap.PlanId
        From AlumnoPlan Ap`, 
        {
            type: QueryTypes.SELECT,
        })
    return alumnosPlan;
}

const obtenerPorId = async(id) => {

    const alumnoPlan = await AlumnoPlan.findByPk(id)
    return alumnoPlan;
}

const crear = async(body) => {

    const alumnoPlan = new AlumnoPlan(body);

    alumnoPlan.Fecha = new Date().getTime();
    alumnoPlan.Activo = true;

    await alumnoPlan.save();

    return alumnoPlan;
}

const actualizar = async (alumnoPlan, body) => {

    alumnoPlan.Fecha = new Date().getTime();

    console.log(body);
    await alumnoPlan.update( body );

    return alumnoPlan;
}

const borrar = async(alumnoPlan) => {
    alumnoPlan.Activo = false;
    await alumnoPlan.save();

    //await alumno.destroy();

    return alumnoPlan;
}
module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    borrar,
}