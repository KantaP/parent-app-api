/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tb_passenger_log_info', {
        log_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        log_type_code: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        log_type_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        log_note: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        passenger_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        quote_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        point_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        date_time_scan: {
            type: DataTypes.DATE,
            allowNull: true
        },
        route_type: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        movement_order: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'tb_passenger_log_info',
        timestamps: false
    });
};