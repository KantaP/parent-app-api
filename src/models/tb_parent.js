/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tb_parent', {
        parent_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        gender: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        parent_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        phone_m: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        notification_choice: {
            type: DataTypes.STRING(45),
            allowNull: false,
            defaultValue: ',3,'
        },
        account: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        relative: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        // token: {
        //     type: DataTypes.STRING(),
        //     allowNull: false
        // },
        // push_token: {
        //     type: DataTypes.STRING(),
        //     allowNull: false
        // }
    }, {
        tableName: 'tb_parent',
        timestamps: false
    });
};