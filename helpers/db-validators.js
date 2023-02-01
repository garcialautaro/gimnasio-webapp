const { Usuario,
        Alumno} = require('../models/index');



const alumnoExiste = async(id) => {
    const existeAlumno = await Alumno.findByPk(id)
    if (!existeAlumno) {
        return `El alumno con id ${id} no se encuentra registrado en la DB`;
    }
    return null;
}

module.exports = {
    alumnoExiste,

}