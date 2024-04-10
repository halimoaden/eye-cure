require('dotenv').config();
const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    port: process.env.DB_PORT,
    host: process.env.DB_HOST
});

const dbConn = async () => {
    try{
        await sequelize.authenticate();
        console.log('Connected successfully.');
    }catch(error){
        console.log('Error: ', error);
    }
};

const dbSync = async () =>{
    try{
        await sequelize.sync();
        console.log('Executed successfully.');
    }catch( error ){
        console.log(error.message);
    }
};

dbConn();
dbSync();


module.exports = {dbConn, dbSync, sequelize, DataTypes};

