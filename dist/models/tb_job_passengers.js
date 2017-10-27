'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tb_job_passengers', {
        job_passengers_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        quote_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        passenger_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        point_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        pickup: {
            type: DataTypes.INTEGER(4),
            allowNull: false
        },
        side: {
            type: DataTypes.INTEGER(1),
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER(4),
            allowNull: false
        },
        date_time_scan: {
            type: DataTypes.DATE,
            allowNull: true
        },
        return: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        force_login: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        log_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        j_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        movement_order: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        }
    }, {
        tableName: 'tb_job_passengers',
        timestamps: false
    });
};
//# sourceMappingURL=tb_job_passengers.js.map