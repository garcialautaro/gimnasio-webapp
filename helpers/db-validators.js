const { Usuario,
        Alumno,
        AlumnoPlan} = require('../models/index');

const alumnoExiste = async(id) => {
    return await Alumno.findByPk(id)

}

const validarAlumnoUsuario = async(id) => {
    const alumno = await Alumno.findOne({ where: { UsuarioId: id, Activo: 1 } })
    if(alumno) return true ;
    return false;
}

const validarAlumnoPersona = async(id) => {
    const alumno = await Alumno.findOne({ where: { PersonaId: id } })
    if(alumno) return true;
    return false;
}

const validarAlumnoPlan = async(id) => {
    const alumnoPlan = await AlumnoPlan.findOne({ where: { AlumnoId: id, Activo: true } })
    if(alumnoPlan) return true;
    return false;
}

module.exports = {
    alumnoExiste,
    validarAlumnoUsuario,
    validarAlumnoPersona,
    validarAlumnoPlan,
}