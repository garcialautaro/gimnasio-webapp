const { response, request } = require('express')
const bcryptjs = require('bcryptjs');
var Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');

const login = async(req, res = response) => {

    const {Contrasenia, Nombre} = req.body;
    
    try {
        //verificar si el email existe

        const usuario = await Usuario.findOne( {
            where: {
                Nombre,
            }
        });
        console.log(usuario);
        if (!usuario) {
            return res.status(400).json({
                msg: 'Nombre de Usuario / Contraseña incorrecto',
            })
        }

        //verificar que el usuario este activo
        if (usuario.UsuarioEstadoId !== 1) {
            return res.status(400).json({
                msg: 'Usuario inhabilitado',
            })
        }
        
        //verificar la contraseña
        const validPassword = await bcryptjs.compareSync(Contrasenia, usuario.Contrasenia);
        console.log(validPassword);
        if (!validPassword) { 
            return res.status(400).json({
                msg: 'Nombre de usuario / Contraseña incorrecto',
            })
        }
        //generar el JWT
        console.log(usuario.id);
        const token = await generarJWT(usuario.id);
        usuario.Contrasenia = "Contraseña encriptada";

        res.json({
            usuario,
            token
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'Algo salio mal',
        })
    }


}

module.exports = {
    login,
}