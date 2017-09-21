/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tb_quote', {
        quote_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        itinerary_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
        site_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        share_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        date_require: {
            type: DataTypes.DATE,
            allowNull: false
        },
        date_booking: {
            type: DataTypes.DATE,
            allowNull: false
        },
        journey: {
            type: DataTypes.INTEGER(6),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        phone_h: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        phone_m: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        passenger_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        passenger_number: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        passenger_email: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        know_where: {
            type: DataTypes.INTEGER(6),
            allowNull: false
        },
        sales_person: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        status_re: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: 'N'
        },
        progress: {
            type: DataTypes.INTEGER(6),
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        total_price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: '0.00'
        },
        price_excbid: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: '0.00'
        },
        deposit: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        deposit_1: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        buy_now: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        cash_job: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            defaultValue: '0'
        },
        comment_p: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        internal: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        pay_ok: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: 'N'
        },
        company_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        callback_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        admin_lock: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        company: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        ext_ref: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        balance_due: {
            type: DataTypes.DATE,
            allowNull: true
        },
        search_query: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        adwords: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        browser: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        account: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        account_invoice: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
        si: {
            type: DataTypes.INTEGER(1),
            allowNull: false
        },
        to_site: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
        to_quote: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
        from_site: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
        pal_pay: {
            type: DataTypes.INTEGER(1),
            allowNull: false
        },
        pal_pay_seats: {
            type: DataTypes.INTEGER(1),
            allowNull: false
        },
        priority: {
            type: DataTypes.INTEGER(3),
            allowNull: false,
            defaultValue: '0'
        },
        default_car_id: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            defaultValue: '0'
        },
        default_num_id: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            defaultValue: '0'
        },
        default_bag_id: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            defaultValue: '0'
        },
        default_journey_id: {
            type: DataTypes.INTEGER(6),
            allowNull: false,
            defaultValue: '0'
        },
        move_to_movement: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        as_directed: {
            type: DataTypes.INTEGER(6),
            allowNull: false,
            defaultValue: '0'
        },
        col_address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        des_address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        date_out: {
            type: DataTypes.DATE,
            allowNull: false
        },
        date_back: {
            type: DataTypes.DATE,
            allowNull: false
        },
        col_latlng: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        des_latlng: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        creator: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        }
    }, {
        tableName: 'tb_quote',
        timestamps: false
    });
};