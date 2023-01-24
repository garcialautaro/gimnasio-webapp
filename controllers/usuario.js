const { request, response } = require('express');
const { Usuario, UsuarioEstado } = require('../models');
const bcryptjs = require('bcryptjs');
const { where } = require('sequelize');

const getUsuarios = async( req = request, res = response ) => {

    const usuario = await Usuario.findAll({
        where: { UsuarioEstadoId: 1 },            
        }
    );

    res.json({ usuario });
}

const getUsuario = async( req = request, res = response ) => {

    const { id } = req.params;

    const usuario = await Usuario.findByPk( id );
    
    if( usuario ) {
        res.json(usuario);
    } else {
        res.status(404).json({
            msg: `No existe un usuario con el id ${ id }`
        });
    }


}

const postUsuario = async( req = request, res = response ) => {

    const { UsuarioEstadoId, ...body } = req;

    try {

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
    const { UsuarioEstadoId, ...body } = req;

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
    res.json(usuario);
}

module.exports = {
    deleteUsuario,
    getUsuario,
    getUsuarios,
    postUsuario,
    putUsuario,
}