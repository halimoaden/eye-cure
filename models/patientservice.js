const {sequelize, DataTypes} = require('../config/db_config');

const PatientService = sequelize.define('patientservice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    patient_id: {
        type: DataTypes.INTEGER
    },
    service_id: {
        type: DataTypes.INTEGER
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    due_amount: {
        type: DataTypes.DOUBLE
    },
    status_info: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    paranoid: true
});

module.exports = PatientService;