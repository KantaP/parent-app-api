import {
    Parent,
    ParentPassenger,
    Passengers,
    JobPassengers,
    Quote,
    Movement,
    PassengerLog,
    Tracking,
    ParentToken,
    Company,
    /*Journey,*/
    MovementOptions
} from './connector'
import { GraphQLScalarType } from 'graphql';
import config from '../config';
// import { Kind } from 'graphql/language';
import moment from 'moment';
// import Sequelize from 'sequelize'
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const checkPermission = (userPermissions, permission) => {
    var check = userPermissions.filter((item) => item == permission || item == 'ALL')
    if (check.length > 0) return true
    else return false
}

const makeJourney = async(pickUpArr, dropOffArr) => {
    var response = {
        collection_address: {},
        destination_address: {},
        extra_address: []
    }
    var collection_address_data = await findMovementData(pickUpArr['point_id'], ['date_start', 'time_start', 'collection_address', 'progress', 'add_lat', 'add_lng', 'movement_order'])
    var destination_address_data = await findMovementData(dropOffArr['point_id'], ['date_start', 'time_start', 'destination_address', 'progress', 'des_lat', 'des_lng', 'movement_order'])
    response = {
        ...response,
        collection_address: Object.assign({}, collection_address_data.get(), {
            time_end: moment(collection_address_data.get().tb_movement_option.get().date_end).utc().format('HH:mm'),
            address: collection_address_data.get().collection_address,
            latlng: collection_address_data.get().add_lat + ',' + collection_address_data.get().add_lng
        })
    }
    response = {
        ...response,
        destination_address: Object.assign({}, destination_address_data.get(), {
            time_end: moment(destination_address_data.get().tb_movement_option.get().date_end).utc().format('HH:mm'),
            address: destination_address_data.get().destination_address,
            latlng: destination_address_data.get().des_lat + ',' + destination_address_data.get().des_lng
        })
    }
    var extra_address_data = await findExtraRoute(pickUpArr.quote_id,
        collection_address_data.get().movement_order,
        destination_address_data.get().movement_order)
    response.extra_address = extra_address_data
        .filter((item) => (item.get().movement_order > collection_address_data.get().movement_order))
        .map((extra) => {
            return {
                movement_order: extra.get().movement_order,
                latlng: extra.get().add_lat + ',' + extra.get().add_lng
            }
        })
    return response
}

const findPassengerLog = ({ point_id, passenger_id, quote_id }) => {
    return new Promise((resolve, reject) => {
        PassengerLog.findAll({
                where: {
                    point_id: {
                        $eq: point_id
                    },
                    passenger_id: {
                        $eq: passenger_id
                    },
                    quote_id: {
                        $eq: quote_id
                    }
                },
                order: [
                    ['log_id', 'DESC']
                ],
                limit: 1
            })
            .then(async(passengerLogs) => {
                if (passengerLogs == null) resolve(null)
                else {
                    for (let i = 0; i < passengerLogs.length; i++) {
                        // console.log(passengerLogs[i])
                        var movement = await Movement.find({
                                where: {
                                    movement_order: passengerLogs[i].get().movement_order,
                                    quote_id: quote_id
                                },
                                attributes: ['collection_address', 'destination_address']
                            })
                            // console.log(movement)
                        passengerLogs[i].address = {
                            collection: movement.get().collection_address,
                            destination: movement.get().destination_address
                        }
                    }
                    resolve(passengerLogs)
                }
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
        parentGlobalSelect(_, args, request) {

        },
        parents(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_PARENTS')) {
                return null
            }
            return Parent.findAll()
        },
        parent(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_PARENT')) {
                return null
            }
            return Parent.find({ where: args })
        },
        parentPassenger(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_PARENT_PASSENGER')) {
                return null
            }
            // return ParentPassenger.find({ where: args })
            return Passengers.findAll({
                include: [{
                    model: ParentPassenger,
                    where: args
                }]
            })
        },
        async passengerRouteToday(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_PASSENGER_ROUTE_TODAY')) {
                return null
            }
            var parentPassenger = await ParentPassenger.find({
                attributes: [],
                include: [{
                    model: Passengers,
                    where: {
                        passenger_id: args['passenger_id']
                    },
                    attributes: ['account']
                }]
            })
            if (parentPassenger == null) return null

            var quote = await Quote.find({
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
                        $eq: parentPassenger.get().tb_passenger.get().account
                    },
                    status_re: {
                        $ne: 'E'
                    }
                },
            })
            if (quote == null) return null

            var jobs = await JobPassengers.findAll({
                attributes: ['quote_id', 'point_id', 'pickup', 'passenger_id', 'j_id'],
                where: {
                    quote_id: {
                        $eq: quote.get().quote_id
                    },
                    passenger_id: args['passenger_id']
                }
            })
            if (jobs == null) return null

            var jobData = jobs.map((job) => job.get())
            var jobDataPickUp = jobData.filter((job) => job.pickup == 1)
            var jobDataDropOff = jobData.filter((job) => job.pickup == 0)
            var journeys = []
            if (jobDataPickUp.length > 0 && jobDataDropOff.length > 0) {
                for (let i = 0; i < jobDataPickUp.length; i++) {
                    var journeyData = await makeJourney(jobDataPickUp[i], jobDataDropOff[i])
                    var col_passenger_log = await findPassengerLog(jobDataPickUp[i])
                    var des_passenger_log = await findPassengerLog(jobDataDropOff[i])
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
                    journeyData.j_id = jobDataPickUp[i].j_id
                    journeyData.date_today = moment().format('DD/MM/YYYY')
                    journeyData.tracking = await Tracking.find({
                        order: [
                            ['track_id', 'DESC']
                        ],
                        attributes: ['lat', 'lng', 'timestamp', 'j_id'],
                        where: {
                            j_id: {
                                $eq: jobDataPickUp[i].j_id
                            }
                        }
                    })
                    journeys.push(journeyData)
                }
                return journeys
            } else {
                return null
            }
        },
        async passengerByQuote(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_PASSENGER_BY_QUOTE')) {
                return null
            }
            var jobPassenger = await Movement.findAll({
                where: args,
                attributes: ['collection_address', 'destination_address', 'movement_id'],
                include: [{
                    model: JobPassengers,
                    attributes: ['passenger_id', 'pickup'],
                    include: [{
                        model: Passengers,
                        attributes: ['first_name']
                    }]
                }],
                order: [
                    ['movement_id', 'ASC']
                ]
            })
            var result = []
            jobPassenger.forEach((item) => {
                result.push({
                    movement_id: item.get().movement_id,
                    collection: item.get().collection_address,
                    destination: item.get().destination_address,
                    pickup: item.get().tb_job_passengers.filter((job) => job.pickup == 1).map((item2) => {
                        item2.passenger = item2.get().tb_passenger.get()
                        return item2
                    }),
                    dropoff: item.get().tb_job_passengers.filter((job) => job.pickup == 0).map((item2) => {
                        item2.passenger = item2.get().tb_passenger.get()
                        return item2
                    })
                })
            })
            return result
        },
        async watchTracking(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_WATCH_TRACKING')) {
                return null
            }
            var tracking = await Tracking.find({
                order: [
                    ['track_id', 'DESC']
                ],
                attributes: ['lat', 'lng', 'timestamp', 'j_id'],
                where: args
            })
            return tracking
        },
        async companyContact(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_COMPANY_DATA')) {
                return null
            }
            var company = await Company.find({
                where: {
                    main_profile: {
                        $eq: 1
                    }
                }
            })
            company.address = company.address.replace(/(?:\\[rn])+/g, " ")
            return company
        }
    },
    Mutation: {
        async parentPasswordUpdate(_, args, request) {
            if (!checkPermission(request.user.mutate, 'UPDATE_PASSWORD')) {
                return {
                    msg: "Your token is operation not permit",
                    status: false
                }
            }
            args.input['password'] = crypto.createHash('md5').update(args.input['password']).digest('hex');
            try {
                var parentUpdate = await Parent.update({ password: args.input['password'] }, { where: { email: args.input['email'], parent_id: request.user.id } })
                return {
                    msg: "Password has been updated",
                    status: true
                }
            } catch (err) {
                return {
                    msg: err.message,
                    status: false
                }
            }
        },
        async parentPushTokenCreate(_, args, request) {
            if (!checkPermission(request.user.mutate, 'CREATE_PUSH_TOKEN')) {
                return {
                    msg: "Your token is operation not permit",
                    status: false
                }
            }
            var parent = await Parent.find({
                where: {
                    email: args.input['email']
                }
            })
            if (parent == null) return { msg: 'Not found parent data.', status: false }
            try {
                var parentTokenCreate = await ParentToken.create({
                    parent_id: parent.get().parent_id,
                    token: args.input['push_token']
                })
                return { msg: 'New token has been added', status: true }
            } catch (err) {
                return { msg: err.message, status: false }
            }
        }
    },
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return moment(value); // value from the client
        },
        serialize(value) {
            return moment(value).utc().format('DD-MM-YYYY HH:mm:ss'); // value sent to the client
        },
        parseLiteral(ast) {},
    })
}

export default resolvers