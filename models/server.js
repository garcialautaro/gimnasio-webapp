const express = require('express')
const cors = require('cors');

const { db, dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            alumno: '/api/alumno',
            profesor: '/api/profesor',
            usuario: '/api/usuario',
            persona: '/api/persona',
            auth: '/api/auth',
        }

        //Conectar con DB
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB() {
        await dbConnection(db)
    }

    middlewares() {

        //CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));
        
    }

    routes() {
        this.app.use(this.paths.alumno, require('../routes/alumno'))
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.persona, require('../routes/persona'))
        this.app.use(this.paths.profesor, require('../routes/profesor'))
        this.app.use(this.paths.usuario, require('../routes/usuario'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Aplicacion corriendo en el puerto ${this.port}`);
        })
    }
}

module.exports = Server;