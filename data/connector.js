import Sequelize from 'sequelize';
const sequelize = new Sequelize('ecm_journey', 'programmer', 'Pa$$wordIT01', {
    host: '52.77.47.28',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// sequelize.sync({ force: false }).then(() => {})

const Parent = sequelize.import('../models/tb_parent.js');
const ParentPassenger = sequelize.import('../models/tb_parent_passenger.js');
const Passengers = sequelize.import('../models/tb_passengers.js');
const JobPassengers = sequelize.import('../models/tb_job_passengers.js');
const Quote = sequelize.import('../models/tb_quote.js');
const Movement = sequelize.import('../models/tb_quote_movement.js');
const MovementOptions = sequelize.import('../models/tb_movement_options.js');
const Journey = sequelize.import('../models/tb_journey.js');
const PassengerLog = sequelize.import('../models/tb_passenger_log_info.js');

ParentPassenger.hasMany(Passengers, { foreignKey: 'passenger_id' });
Passengers.hasMany(ParentPassenger, { foreignKey: 'passenger_id' });
Passengers.hasMany(JobPassengers, { foreignKey: 'passenger_id' });
JobPassengers.belongsTo(Passengers, { foreignKey: 'passenger_id' });
Movement.hasOne(MovementOptions, { foreignKey: 'movement_id' });
MovementOptions.hasMany(Movement, { foreignKey: 'movement_id' });
JobPassengers.hasMany(Quote, { foreignKey: 'quote_id' });
Quote.hasMany(JobPassengers, { foreignKey: 'quote_id' });
// JobPassengers.belongsTo(Movement, { foreignKey: 'quote_id' });
// Movement.belongsTo(JobPassengers, { foreignKey: 'quote_id' });
// Quote.hasMany(JobPassengers, { foreignKey: 'quote_id' });
// Quote.hasMany(Journey, { foreignKey: 'quote_id' });
// Quote.hasMany(Movement, { foreignKey: 'quote_id' });
// Journey.belongsTo(Movement, { foreignKey: 'j_id' });
// Movement.hasOne(Journey, { foreignKey: 'j_id' });
// Movement.hasOne(Quote, { foreignKey: 'quote_id' });
// Journey.hasOne(Quote, { foreignKey: 'quote_id' });

export { Parent, ParentPassenger, Passengers, JobPassengers, Quote, Movement, Journey, MovementOptions, PassengerLog }