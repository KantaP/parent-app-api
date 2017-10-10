/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tb_company_data', {
        company_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        company_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        tel: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        mobile: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        sale_email: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        sale_email2: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        operation_email: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        operation_email2: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        trip_email: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        reg_company_name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        reg_company_number: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        tax_ref: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        buy_it_now: {
            type: DataTypes.INTEGER(1),
            allowNull: false
        },
        bin_per: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        bin_round: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        bin_superscreen_pending: {
            type: DataTypes.INTEGER(3),
            allowNull: false,
            defaultValue: '0'
        },
        bin_superscreen_booked: {
            type: DataTypes.INTEGER(3),
            allowNull: false,
            defaultValue: '0'
        },
        email_host: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        email_user: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        email_pass: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        email_port: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '25'
        },
        currency: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        currency_before: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '1'
        },
        balance_due: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        deposit: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        meta_title: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        meta_des: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        meta_key: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        auto_price: {
            type: DataTypes.INTEGER(1),
            allowNull: false
        },
        price_percent: {
            type: DataTypes.INTEGER(3),
            allowNull: false,
            defaultValue: '0'
        },
        dep_is_per: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '1'
        },
        emgtel: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        journey_price: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '1'
        },
        is_billing: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '0'
        },
        com_bill_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
        inv_logo: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        prefix_bill: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        auto_copy_cust: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '1'
        },
        main_profile: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        }
    }, {
        tableName: 'tb_company_data',
        timestamps: false
    });
};