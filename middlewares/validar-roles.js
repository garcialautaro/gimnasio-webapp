const { request, response } = require("express")


const esAdminRol = (req= request, res = response, next) => {
    if (!req.Usuario) {
        res.status(500).json({
            msg: 'Se quiere verificar el rol son validar el token'
        })
    }

    const { rol, nombre } = req.Usuario;

    if(rol !== 'ADMIN_ROL') {
        res.status(401).json({
            msg: `${nombre} no posee permisos para realizar esa accion`
        });
    }
    
    next();
}


const tieneRol = (...roles ) => {

    return (req = request, res = response, next) => {
        
        if (!req.Usuario) {
            res.status(500).json({
                msg: 'Se quiere verificar el rol son validar el token'
            })
        }

        const { nombre, rol } = req.Usuario;
        if (!roles.includes(rol)) {
            res.status(401).json({
                msg: `${nombre} no posee permisos para realizar esa accion`
            });
        }

        next();
    }
}

module.exports = {
    esAdminRol,
    tieneRol,
}