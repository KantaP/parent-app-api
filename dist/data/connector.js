'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sequelizeInitial = undefined;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var sequelize = new Sequelize('ecm_journey', 'programmer', 'Pa$$wordIT01', {
//     host: '52.77.47.28',
//     dialect: 'mysql',
//     pool: {
//         max: 5,
//         min: 0,
//         idle: 10000
//     }
// });

// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

// sequelize.sync({ force: false }).then(() => {})
var sequelizeInitial = function sequelizeInitial(DBname) {

    if (DBname != 'ecm_share') {
        var sequelize = new _sequelize2.default(DBname, 'root', '3EwqdeFT$', {
            host: 'singapore-ecm.cbdc0q4tfird.ap-southeast-1.rds.amazonaws.com',
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        });

        var Parent = sequelize.import('../models/tb_parent.js');
        var ParentPassenger = sequelize.import('../models/tb_parent_passenger.js');
        var Passengers = sequelize.import('../models/tb_passengers.js');
        var JobPassengers = sequelize.import('../models/tb_job_passengers.js');
        var Quote = sequelize.import('../models/tb_quote.js');
        var Movement = sequelize.import('../models/tb_quote_movement.js');
        var MovementOptions = sequelize.import('../models/tb_movement_options.js');
        var Journey = sequelize.import('../models/tb_journey.js');
        var PassengerLog = sequelize.import('../models/tb_passenger_log_info.js');
        var Tracking = sequelize.import('../models/tb_tracking.js');
        var ParentToken = sequelize.import('../models/tb_parent_token.js');
        var Company = sequelize.import('../models/tb_company_data.js');
        var Account = sequelize.import('../models/tb_accounts.js');

        ParentPassenger.belongsTo(Passengers, { foreignKey: 'passenger_id' });
        ParentPassenger.belongsTo(Parent, { foreignKey: 'parent_id' });
        Parent.hasMany(ParentPassenger, { foreignKey: 'parent_id' });
        Passengers.hasMany(ParentPassenger, { foreignKey: 'passenger_id' });
        Passengers.hasMany(JobPassengers, { foreignKey: 'passenger_id' });
        JobPassengers.belongsTo(Passengers, { foreignKey: 'passenger_id' });
        Movement.hasOne(MovementOptions, { foreignKey: 'movement_id' });
        MovementOptions.hasMany(Movement, { foreignKey: 'movement_id' });
        JobPassengers.hasMany(Quote, { foreignKey: 'quote_id' });
        Quote.hasMany(JobPassengers, { foreignKey: 'quote_id' });

        JobPassengers.belongsTo(Movement, { foreignKey: 'point_id' });
        Movement.hasMany(JobPassengers, { foreignKey: 'point_id' });

        return {
            Parent: Parent,
            ParentPassenger: ParentPassenger,
            Passengers: Passengers,
            JobPassengers: JobPassengers,
            Quote: Quote,
            Movement: Movement,
            Journey: Journey,
            MovementOptions: MovementOptions,
            PassengerLog: PassengerLog,
            Tracking: Tracking,
            ParentToken: ParentToken,
            Company: Company,
            Account: Account
        };
    } else {
        var sequelize = new _sequelize2.default('ecm_share', 'paths', 'paths', {
            host: 'singapore-ecm.cbdc0q4tfird.ap-southeast-1.rds.amazonaws.com',
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        });
        var ParentGlobal = sequelize.import('../models/tb_parent_global.js');
        var ParentDetail = sequelize.import('../models/tb_parent_detail.js');
        var ParentToken = sequelize.import('../models/tb_parent_token.js');
        // ParentGlobal.hasMany(ParentDetail, { foreignKey: 'parent_id' })
        // ParentDetail.belongsTo(ParentGlobal)
        ParentGlobal.hasMany(ParentToken, { foreignKey: 'parent_id' });
        ParentToken.belongsTo(ParentGlobal, { foreignKey: 'parent_id' });
        return {
            ParentGlobal: ParentGlobal,
            ParentDetail: ParentDetail,
            ParentToken: ParentToken
        };
    }
};

exports.sequelizeInitial = sequelizeInitial;

// const Parent = sequelize.import('../models/tb_parent.js');
// const ParentPassenger = sequelize.import('../models/tb_parent_passenger.js');
// const Passengers = sequelize.import('../models/tb_passengers.js');
// const JobPassengers = sequelize.import('../models/tb_job_passengers.js');
// const Quote = sequelize.import('../models/tb_quote.js');
// const Movement = sequelize.import('../models/tb_quote_movement.js');
// const MovementOptions = sequelize.import('../models/tb_movement_options.js');
// const Journey = sequelize.import('../models/tb_journey.js');
// const PassengerLog = sequelize.import('../models/tb_passenger_log_info.js');
// const Tracking = sequelize.import('../models/tb_tracking.js');
// const ParentToken = sequelize.import('../models/tb_parent_token.js');
// const Company = sequelize.import('../models/tb_company_data.js');

// ParentPassenger.belongsTo(Passengers, { foreignKey: 'passenger_id' });
// ParentPassenger.belongsTo(Parent, { foreignKey: 'parent_id' });
// Parent.hasMany(ParentPassenger, { foreignKey: 'parent_id' });
// Passengers.hasMany(ParentPassenger, { foreignKey: 'passenger_id' });
// Passengers.hasMany(JobPassengers, { foreignKey: 'passenger_id' });
// JobPassengers.belongsTo(Passengers, { foreignKey: 'passenger_id' });
// Movement.hasOne(MovementOptions, { foreignKey: 'movement_id' });
// MovementOptions.hasMany(Movement, { foreignKey: 'movement_id' });
// JobPassengers.hasMany(Quote, { foreignKey: 'quote_id' });
// Quote.hasMany(JobPassengers, { foreignKey: 'quote_id' });

// JobPassengers.belongsTo(Movement, { foreignKey: 'point_id' });
// Movement.hasMany(JobPassengers, { foreignKey: 'point_id' });
// JobPassengers.belongsTo(Movement, { foreignKey: 'quote_id' });
// Movement.belongsTo(JobPassengers, { foreignKey: 'quote_id' });
// Quote.hasMany(JobPassengers, { foreignKey: 'quote_id' });
// Quote.hasMany(Journey, { foreignKey: 'quote_id' });
// Quote.hasMany(Movement, { foreignKey: 'quote_id' });
// Journey.belongsTo(Movement, { foreignKey: 'j_id' });
// Movement.hasOne(Journey, { foreignKey: 'j_id' });
// Movement.hasOne(Quote, { foreignKey: 'quote_id' });
// Journey.hasOne(Quote, { foreignKey: 'quote_id' });

// export {
//     Parent,
//     ParentPassenger,
//     Passengers,
//     JobPassengers,
//     Quote,
//     Movement,
//     Journey,
//     MovementOptions,
//     PassengerLog,
//     Tracking,
//     ParentToken,
//     Company
// }
//# sourceMappingURL=connector.js.map