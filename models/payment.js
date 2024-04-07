const { sequelize, DataTypes } = require('../config/db_config');

const Payment = sequelize.define('payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pat_ser_id: {
        type: DataTypes.INTEGER
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    payment_method:{
        type: DataTypes.STRING
    },
    amount: {
        type: DataTypes.DOUBLE
    },
    payment_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    paranoid: true
});


module.exports = Payment;