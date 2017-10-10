'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tb_parent_token', {
        parent_token_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        parent_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'tb_parent_token',
        timestamps: false
    });
};
//# sourceMappingURL=tb_parent_token.js.map