const {sequelize, DataTypes} = require('../config/db_config')

const Village = sequelize.define('village', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    village_name: {
        type: DataTypes.STRING
    },
    district_id: {
        type: DataTypes.INTEGER
    }
},{
    paranoid: true
});

module.exports = Village