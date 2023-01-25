const { request, response } = require('express');
const { Usuario } = require('../models');
const bcryptjs = require('bcryptjs');
const { QueryTypes } = require('sequelize');
const generarContrasenia = require('../helpers/generar-contrasenia');

const getUsuarios = async( req = request, res = response ) => {

    const usuarios = await Usuario.sequelize.query(
        `SELECT U.Id, U.Nombre, U.Alias, U.Email,
        E.Nombre AS Estado
        FROM Usuario U INNER JOIN UsuarioEstado E ON U.UsuarioEstadoId = E.Id 
        WHERE U.UsuarioEstadoId = 1`, 
        {
            type: QueryTypes.SELECT
        })
    
    res.json({ usuarios });
}

const getUsuario = async( req = request, res = response ) => {

    const { id } = req.params;

    const usuario = await Usuario.sequelize.query(
        `SELECT U.Id, U.Nombre, U.Alias, U.Email,
        E.Nombre AS Estado
        FROM Usuario U INNER JOIN UsuarioEstado E ON U.UsuarioEstadoId = E.Id 
        WHERE U.Id=${id}`, 
        {
            type: QueryTypes.SELECT
        })
    
    if( usuario ) {
        res.json(usuario);
    } else {
        res.status(404).json({
            msg: `No existe un usuario con el id ${ id }`
        });
    }


}

const postUsuario = async( req = request, res = response ) => {

    const { UsuarioEstadoId, ...body } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ where: { Nombre: body.Nombre }});
        if( usuarioDB ) {
            res.status(500).json({
                msg: `Ya existe un usuario con ese nombre`
            })
        }
        const usuario = new Usuario(body);
        usuario.UsuarioEstadoId = 1;

        const salt = bcryptjs.genSaltSync();
        usuario.Contrasenia = bcryptjs.hashSync(body.Contrasenia, salt);
        await usuario.save();

        res.json( usuario );

    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })    
    }
}

const putUsuario = async( req = request, res = response ) => {

    const { id }   = req.params;
    const { UsuarioEstadoId, Contrasenia, ...body } = req.body;

    try {
        
        const usuario = await Usuario.findByPk( id );
        if ( !usuario || usuario.UsuarioEstadoId !== 1) {
            return res.status(404).json({
                msg: 'No existe un usuario con el id ' + id
            });
        }

        await usuario.update( body );

        res.json( usuario );

    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })    
    }   
}

const cambiarContrasenia = async( req = request, res = response ) => {

    const { id }   = req.params;
    let { Contrasenia } = req.body;
    const contraseniaSinHash = Contrasenia;
    try {
        
        const usuario = await Usuario.findByPk( id );
        if ( !usuario || usuario.UsuarioEstadoId !== 1) {
            return res.status(404).json({
                msg: 'No existe un usuario con el id ' + id
            });
        }

        const salt = bcryptjs.genSaltSync();
        Contrasenia = bcryptjs.hashSync(Contrasenia, salt);

        await usuario.update( {Contrasenia} );

        res.json( {
            nuevaContrasenia: contraseniaSinHash
        } );


    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })    
    }   
}

const reestablecerContrasenia = async( req = request, res = response ) => {

    const { id }   = req.params;
    let ContraseniaSinHash = generarContrasenia(10);
    try {
        
        const usuario = await Usuario.findByPk( id );
        if ( !usuario || usuario.UsuarioEstadoId !== 1) {
            return res.status(404).json({
                msg: 'No existe un usuario con el id ' + id
            });
        }

        const salt = bcryptjs.genSaltSync();
        const Contrasenia = bcryptjs.hashSync(ContraseniaSinHash, salt);

        await usuario.update( {Contrasenia} );

        res.json( {
            nuevaContrasenia: ContraseniaSinHash
        } );


    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })    
    }   
}

const deleteUsuario = async( req = request, res = response ) => {

    const { id } = req.params;

    const usuario = await Usuario.findByPk( id );
    if ( !usuario ) {
        return res.status(404).json({
            msg: 'No existe un usuario con el id ' + id
        });
    }

    usuario.UsuarioEstadoId = 2;
    usuario.save();

    //await usuario.destroy();
    res.json({
        msg: `Usuario ${usuario.Nombre} eliminado`
    });
}

module.exports = {
    deleteUsuario,
    cambiarContrasenia,
    getUsuario,
    getUsuarios,
    postUsuario,
    putUsuario,
    reestablecerContrasenia,
}