const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Society = require('./Society');

const MaintenanceConfig = sequelize.define('MaintenanceConfig', {
    societyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: Society,
            key: 'id'
        }
    },
    charges: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    dueDay: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 15
    }
}, {
    tableName: 'maintenance',
    timestamps: false
});

MaintenanceConfig.belongsTo(Society, { foreignKey: 'societyId' });
Society.hasOne(MaintenanceConfig, { foreignKey: 'societyId' });

module.exports = MaintenanceConfig;
