const {sequelize, DataTypes} = require('../config/db_config');

const Patient = sequelize.define('patient', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.INTEGER
    },
    email: {
        type: DataTypes.STRING
    },
    village_id: {
        type: DataTypes.INTEGER
    }
},{
    paranoid: true
});

module.exports = Patient;