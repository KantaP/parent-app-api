/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tb_parent_global', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        accept_email: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        accept_notification: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        }
    }, {
        tableName: 'tb_parent_global',
        timestamps: false
    });
};