const {sequelize, DataTypes} = require('../config/db_config')

const District = sequelize.define('district', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    district_name: {
        type: DataTypes.STRING
    }
},{
    paranoid: true
});

module.exports = District