/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tb_tracking', {
        track_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        site_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        quote_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        movement_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        driver_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        affiliateDriver: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        vehicle_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        lat: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        lng: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        speed: {
            type: DataTypes.INTEGER(4),
            allowNull: false
        },
        accuracy: {
            type: DataTypes.INTEGER(4),
            allowNull: false
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        tracking_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER(4),
            allowNull: false
        },
        progress: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        location_name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        j_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        }
    }, {
        tableName: 'tb_tracking',
        timestamps: false
    });
};