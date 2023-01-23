const { Sequelize } = require('sequelize');

const db = new Sequelize(   process.env.MSSQL_DATABASE_NAME,
                            process.env.MSSQL_USER_NAME,
                            process.env.MSSQL_USER_PASSWORD, {
    host: 'localhost',
    dialect: 'mssql',
    define: { 
        freezeTableName: true, 
        timestamps: false
    },
        
})


const dbConnection = async(db) => { 
    try {
        await db.authenticate();
        console.log('Base de datos online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la coneccion con la base de datos')
    }
} 

module.exports = {
    dbConnection,
    db,
}