/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tb_quote_movement', {
        movement_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        quote_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        is_start: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '0'
        },
        is_return: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '0'
        },
        date_start: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        time_start: {
            type: DataTypes.TIME,
            allowNull: true
        },
        datetime_start: {
            type: DataTypes.DATE,
            allowNull: true
        },
        collection_address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        collection_notes: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        destination_address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        destination_notes: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        as_directed: {
            type: DataTypes.INTEGER(6),
            allowNull: false,
            defaultValue: '0'
        },
        journey_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
        flight: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        flight_time: {
            type: DataTypes.DATE,
            allowNull: true
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
            type: DataTypes.STRING(100),
            allowNull: false
        },
        add_lat: {
            type: "DOUBLE",
            allowNull: true
        },
        add_lng: {
            type: "DOUBLE",
            allowNull: true
        },
        des_lat: {
            type: "DOUBLE",
            allowNull: true
        },
        des_lng: {
            type: "DOUBLE",
            allowNull: true
        },
        mileage: {
            type: DataTypes.INTEGER(6),
            allowNull: false,
            defaultValue: '0'
        },
        duration: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        distance: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        wait_minutes: {
            type: DataTypes.INTEGER(3),
            allowNull: false
        },
        progress: {
            type: DataTypes.INTEGER(2),
            allowNull: false
        },
        num_id: {
            type: DataTypes.INTEGER(4),
            allowNull: false
        },
        bag_id: {
            type: DataTypes.INTEGER(6),
            allowNull: false
        },
        car_id: {
            type: DataTypes.INTEGER(6),
            allowNull: false
        },
        system_note: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        has_driver: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '0'
        },
        driver_confirm: {
            type: DataTypes.DATE,
            allowNull: true
        },
        journey_price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        vat_amount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        vat_incl: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '0'
        },
        vat_rate: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        vehicle_stay: {
            type: DataTypes.INTEGER(4),
            allowNull: true
        },
        movement_order: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            defaultValue: '1'
        },
        j_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        is_end: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        flight_arrival: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        flight_arrival_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        mileage_raw: {
            type: DataTypes.INTEGER(10),
            allowNull: false
        },
        duration_raw: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        airport_arrival: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        terminal_arrival: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        airport_departure: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        terminal_departure: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        tableName: 'tb_quote_movement',
        timestamps: false
    });
};