import {
    Parent,
    ParentPassenger,
    Passengers,
    JobPassengers,
    Quote,
    Movement,
    PassengerLog,
    /*Journey,*/
    MovementOptions
} from './connector'
import { GraphQLScalarType } from 'graphql';
// import { Kind } from 'graphql/language';
import moment from 'moment';
// import Sequelize from 'sequelize'
const crypto = require('crypto');

const makeJourney = async(pickUpArr, dropOffArr) => {
    var response = {
        collection_address: {},
        destination_address: {},
        extra_address: []
    }
    var collection_address_data = await findMovementData(pickUpArr.point_id, ['date_start', 'time_start', 'collection_address', 'progress', 'add_lat', 'add_lng', 'movement_order'])
    var destination_address_data = await findMovementData(dropOffArr.point_id, ['date_start', 'time_start', 'destination_address', 'progress', 'des_lat', 'des_lng', 'movement_order'])
    response = {
        ...response,
        collection_address: Object.assign({}, collection_address_data.get(), {
            time_end: moment(collection_address_data.get().tb_movement_option.date_end).utc().format('HH:mm'),
            address: collection_address_data.get().collection_address,
            latlng: collection_address_data.get().add_lat + ',' + collection_address_data.get().add_lng
        })
    }
    response = {
        ...response,
        destination_address: Object.assign({}, destination_address_data.get(), {
            time_end: moment(destination_address_data.get().tb_movement_option.date_end).utc().format('HH:mm'),
            address: destination_address_data.get().destination_address,
            latlng: destination_address_data.get().des_lat + ',' + destination_address_data.get().des_lng
        })
    }
    var betweenMovement = destination_address_data.get().movement_order - collection_address_data.get().movement_order
    if (betweenMovement > 1) {
        var extra_address_data = await findExtraRoute(pickUpArr.quote_id,
            collection_address_data.get().movement_order + 1,
            destination_address_data.get().movement_order - 1)
        response.extra_address = extra_address_data.map((extra) => {
            return {
                movement_order: extra.get().movement_order,
                latlng: extra.get().add_lat + ',' + extra.get().add_lng
            }
        })
    }
    return response
}

const findPassengerLog = (movement_id, passenger_id) => {
    return new Promise((resolve, reject) => {
        PassengerLog.findAll({
                where: {
                    point_id: {
                        $eq: movement_id
                    },
                    passenger_id: {
                        $eq: passenger_id
                    },
                }
            })
            .then((jobPassenger) => {
                resolve(jobPassenger)
            })
    })
}

const findExtraRoute = (quote_id, movement_start, movement_end) => {
    return new Promise((resolve, reject) => {
        Movement.findAll({
                attributes: ['movement_order', 'add_lat', 'add_lng'],
                where: {
                    quote_id: {
                        $eq: quote_id
                    },
                    movement_order: {
                        $between: [movement_start, movement_end]
                    }
                }
            })
            .then((movements) => {
                resolve(movements)
            })
    })
}

const findMovementData = (movement_id, attributes) => {
    return new Promise((resolve, reject) => {
        // console.log(movement_id)
        Movement.find({
                attributes: attributes,
                include: [{
                    model: MovementOptions,
                    as: 'tb_movement_option',
                    attributes: ['date_end']
                }],
                where: {
                    movement_id: {
                        $eq: movement_id
                    }
                }
            })
            .then((movement) => {
                resolve(movement)
            })
            .catch((err) => console.log(err.message))
    })
}

const resolvers = {
    Query: {
        parents() {
            return Parent.findAll()
        },
        parent(_, args) {
            return Parent.find({ where: args })
        },
        parentWithPassword(_, args) {
            args['password'] = crypto.createHash('md5').update(args['password']).digest('hex');
            return Parent.find({ where: args })
        },
        parentPassenger(_, args) {
            // return ParentPassenger.find({ where: args })
            return Passengers.findAll({
                include: [{
                    model: ParentPassenger,
                    where: args
                }]
            })
        },
        passengers(_, args) {
            return Passengers.findAll({ where: { passenger_id: { $in: args['passenger_id'] } } })
        },
        passengerRouteToday(_, args) {
            return new Promise((resolve, reject) => {
                Passengers.find({
                        attributes: ['account'],
                        where: args
                    })
                    .then((passenger) => {
                        return Quote.find({
                            attributes: ['quote_id'],
                            include: [{
                                attributes: [],
                                model: JobPassengers,
                                required: true
                            }],
                            where: {
                                date_out: {
                                    $between: [moment().format('YYYY-MM-DD') + ' 00:00:00', moment().format('YYYY-MM-DD') + ' 23:59:59']
                                },
                                account: {
                                    $eq: passenger.get().account
                                },
                                status_re: {
                                    $ne: 'E'
                                }
                            },
                        })
                    })
                    .then((quote) => {
                        // console.log(quote.get().quote_id)
                        if (quote == null || !quote) {
                            quote = {
                                get: () => {
                                    return {
                                        quote_id: 0
                                    }
                                }
                            }
                        }
                        return JobPassengers.findAll({
                            attributes: ['quote_id', 'point_id', 'pickup', 'passenger_id'],
                            where: {
                                quote_id: {
                                    $eq: quote.get().quote_id
                                },
                                passenger_id: args['passenger_id']
                            }
                        })
                    })
                    .then(async(jobs) => {
                        if (jobs.length == 0) resolve(null)
                        var jobData = jobs.map((job) => job.get())
                        var jobDataPickUp = jobData.filter((job) => job.pickup == 1)
                        var jobDataDropOff = jobData.filter((job) => job.pickup == 0)
                        var journeys = []
                        for (let i = 0; i < jobDataPickUp.length; i++) {
                            var journeyData = await makeJourney(jobDataPickUp[i], jobDataDropOff[i])
                            var col_passenger_log = await findPassengerLog(jobDataPickUp[i].point_id, jobDataPickUp[i].passenger_id)
                            var des_passenger_log = await findPassengerLog(jobDataDropOff[i].point_id, jobDataDropOff[i].passenger_id)
                            journeyData.collection_address.passenger_log = (col_passenger_log.length > 0) ? col_passenger_log.map((item) => item.get()) : []
                            journeyData.destination_address.passenger_log = (des_passenger_log) ? des_passenger_log.map((item) => item.get()) : []
                            journeyData.collection_address.time_start = moment(journeyData.collection_address.time_start, 'HH:mm:ss').format('HH:mm')
                            var datetime_start = moment(`${journeyData.collection_address.date_start} ${journeyData.collection_address.time_start}`, 'YYYY-MM-DD HH:mm').utc()
                            var datetime_end = moment(`${journeyData.destination_address.date_start} ${journeyData.destination_address.time_end}`, 'YYYY-MM-DD HH:mm').utc()
                            if (moment().isBetween(datetime_start, datetime_end)) {
                                journeyData.peroid = 'current'
                            } else if (moment().isBefore(datetime_start)) {
                                journeyData.peroid = 'next'
                            } else if (moment().isAfter(datetime_end)) {
                                journeyData.peroid = 'previous'
                            }
                            journeyData.date_today = moment().format('DD/MM/YYYY')
                            journeys.push(journeyData)
                        }
                        resolve(journeys)
                    })
            });
        }
    },
    Mutation: {
        setPassword(_, args) {
            args['password'] = crypto.createHash('md5').update(args['password']).digest('hex');
            return new Promise((resolve, reject) => {
                Parent.update({ password: args['password'] }, { where: { email: args['email'] } }).then((result) => {
                    resolve(Parent.find({ where: args }))
                }).catch((err) => {
                    reject(err)
                })
            })
        }
    },
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return moment(value); // value from the client
        },
        serialize(value) {
            // console.log(moment(value).toString())
            return moment(value).utc().format('DD-MM-YYYY HH:mm:ss'); // value sent to the client
        },
        parseLiteral(ast) {
            // if (ast.kind === Kind.INT) {
            //     return parseInt(ast.value, 10); // ast value is always in string format
            // }
            // return null;
        },
    })
}

export default resolvers