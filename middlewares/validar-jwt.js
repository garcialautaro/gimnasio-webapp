const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res= response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg:'No hay token en la peticion'
        })
    }

    try {

        const {uid} = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);

        //Leer el usuario de la base de datos
        const usuario = await Usuario.findByPk(uid);

        //Verificar que el usuario exista
        if (!usuario) {
            return res.status(401).json({
                msg:'Usuario no existente en la DB'
            })
        }

        //Verificar si el usuario tiene estado en true
        // if(!usuario.estado) {
        //     return res.status(401).json({
        //         msg:'Token no valido (usuario estado)'
        //     })
        // }

        req.Usuario = usuario;
        next();

    } catch (e) {
        console.log(e);

        res.status(401).json({ 
            msg:'Token no válido'
        })
    }    
}

module.exports = {
    validarJWT
}