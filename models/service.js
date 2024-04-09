const {sequelize, DataTypes} = require('../config/db_config');

const Service = sequelize.define('service', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    service_name: {
        type: DataTypes.STRING
    }
},{
    paranoid: true
});

module.exports = Service;