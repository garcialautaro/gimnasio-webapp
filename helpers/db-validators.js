const { Categoria, 
        Role,
        Usuario,
        Producto} = require('../models/index');

const correoExiste = async(correo='') => {
    const existeCorreo = await Usuario.findOne({correo})
    if (existeCorreo) {
        throw new Error(`El email ${correo} ya se encuentra registrado en la DB`);
    }
}

const usuarioExiste = async(id) => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El usuario con id ${id} no se encuentra registrado en la DB`);
    }
}

const categoriaExiste = async(id) => {
    const existeCategoria = await Categoria.findById(id)
    if (!existeCategoria) {
        throw new Error(`La categoria con id ${id} no se encuentra registrado en la DB`);
    }
}

const productoExiste = async(id) => {
    const existeProducto = await Producto.findById(id)
    if (!existeProducto) {
        throw new Error(`El producto con id ${id} no se encuentra registrado en la DB`);
    }
}

//validar colecciones permitidas

const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if ( !incluida) {
        throw new Error(`La coleccion ${coleccion} no está permitida (${colecciones})`);
    }
    return true;
}
module.exports = {
    esRolValido,
    correoExiste,
    usuarioExiste,
    categoriaExiste,
    productoExiste,
    coleccionesPermitidas,
}