/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tb_accounts', {
        account_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        ref: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        billing_address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        address2: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        city: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        state: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        country: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        com_bill_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
        postal_code: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        website: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        account_type: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        vat_no: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        language: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        contact_name: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        phone2: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        credit_limit: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        admin_fee: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        discount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        pay_days: {
            type: DataTypes.INTEGER(3),
            allowNull: false,
            defaultValue: '14'
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        active: {
            type: DataTypes.INTEGER(1),
            allowNull: false
        },
        require_ref: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '0'
        },
        uplift_by: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '2'
        },
        uplift_percent: {
            type: DataTypes.INTEGER(3),
            allowNull: false
        },
        uplift_price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: '0.00'
        },
        exclude_bid: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '0'
        },
        send_price: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '1'
        },
        hours_b4out: {
            type: DataTypes.INTEGER(4),
            allowNull: false
        },
        set_sales_person: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        com_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
        auto_price: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '0'
        },
        auto_invoice: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '0'
        },
        car_autoprice: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        disable_journey_types: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        hide_booking: {
            type: DataTypes.INTEGER(1),
            allowNull: false
        },
        hide_booking_user: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '0'
        },
        settlement_dis: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        settlement_val: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        cash_account: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        vat_exempt: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        individual_invoice: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        bulk_inv: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '1'
        },
        email_api: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '1'
        },
        inc_price: {
            type: DataTypes.INTEGER(3),
            allowNull: false
        },
        user_cate_notification: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        tracking_enabled: {
            type: DataTypes.INTEGER(4),
            allowNull: false
        },
        colour: {
            type: DataTypes.STRING(7),
            allowNull: false
        },
        company_logo: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        tracking_phone: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        tracking_email: {
            type: DataTypes.STRING(),
            allowNull: false
        }

    }, {
        tableName: 'tb_accounts',
        timestamps: false
    });
};