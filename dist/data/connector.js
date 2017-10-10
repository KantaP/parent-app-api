'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Company = exports.ParentToken = exports.Tracking = exports.PassengerLog = exports.MovementOptions = exports.Journey = exports.Movement = exports.Quote = exports.JobPassengers = exports.Passengers = exports.ParentPassenger = exports.Parent = undefined;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sequelize = new _sequelize2.default('ecm_journey', 'programmer', 'Pa$$wordIT01', {
    host: '52.77.47.28',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

sequelize.authenticate().then(function () {
    console.log('Connection has been established successfully.');
}).catch(function (err) {
    console.error('Unable to connect to the database:', err);
});

// sequelize.sync({ force: false }).then(() => {})

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
// JobPassengers.belongsTo(Movement, { foreignKey: 'quote_id' });
// Movement.belongsTo(JobPassengers, { foreignKey: 'quote_id' });
// Quote.hasMany(JobPassengers, { foreignKey: 'quote_id' });
// Quote.hasMany(Journey, { foreignKey: 'quote_id' });
// Quote.hasMany(Movement, { foreignKey: 'quote_id' });
// Journey.belongsTo(Movement, { foreignKey: 'j_id' });
// Movement.hasOne(Journey, { foreignKey: 'j_id' });
// Movement.hasOne(Quote, { foreignKey: 'quote_id' });
// Journey.hasOne(Quote, { foreignKey: 'quote_id' });

exports.Parent = Parent;
exports.ParentPassenger = ParentPassenger;
exports.Passengers = Passengers;
exports.JobPassengers = JobPassengers;
exports.Quote = Quote;
exports.Movement = Movement;
exports.Journey = Journey;
exports.MovementOptions = MovementOptions;
exports.PassengerLog = PassengerLog;
exports.Tracking = Tracking;
exports.ParentToken = ParentToken;
exports.Company = Company;
//# sourceMappingURL=connector.js.map