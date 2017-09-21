/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tb_passengers', {
        passenger_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        uniqueID: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        surname: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        date_of_birth: {
            type: DataTypes.DATE,
            allowNull: true
        },
        gender: {
            type: DataTypes.STRING(2),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        phone_m: {
            type: DataTypes.STRING(55),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        photo: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        account: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        RFID: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'tb_passengers',
        timestamps: false
    });
};