import { sequelizeInitial } from './connector';
import { GraphQLScalarType } from 'graphql';
import config from '../config';
import moment from 'moment';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const checkPermission = (userPermissions, permission) => {
    var check = userPermissions.filter((item) => item == permission || item == 'ALL')
    if (check.length > 0) return true
    else return false
}
var globalDB = null
const makeJourney = async(pickUpArr, dropOffArr) => {
    var response = {
        collection_address: {},
        destination_address: {},
        extra_address: []
    }
    var collection_address_data = await findMovementData(pickUpArr['point_id'], ['date_start', 'time_start', 'collection_address', 'progress', 'add_lat', 'add_lng', 'movement_order']) || undefined
    var destination_address_data = await findMovementData(dropOffArr['point_id'], ['date_start', 'time_start', 'destination_address', 'progress', 'des_lat', 'des_lng', 'movement_order']) || undefined
    response = {
        ...response,
        collection_address: Object.assign({}, (collection_address_data) ? collection_address_data.get() : {}, {
            time_end: moment(collection_address_data.get().tb_movement_option.get().date_end).utc().format('HH:mm'),
            address: collection_address_data.get().collection_address,
            latlng: collection_address_data.get().add_lat + ',' + collection_address_data.get().add_lng
        })
    }
    response = {
        ...response,
        destination_address: Object.assign({}, (destination_address_data) ? destination_address_data.get() : {}, {
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

const findPassengerLog = ({ point_id, passenger_id, quote_id, pickup }) => {
    return new Promise((resolve, reject) => {
        // globalDB.PassengerLog.findAll({
        //         where: {
        //             point_id: {
        //                 $eq: point_id
        //             },
        //             passenger_id: {
        //                 $eq: passenger_id
        //             },
        //             quote_id: {
        //                 $eq: quote_id
        //             }
        //         },
        //         order: [
        //             ['log_id', 'DESC']
        //         ],
        //         limit: 1
        //     })
        //     .then(async(passengerLogs) => {
        //         if (passengerLogs == null) resolve(null)
        //         else {
        //             for (let i = 0; i < passengerLogs.length; i++) {
        //                 // console.log(passengerLogs[i])
        //                 var movement = await globalDB.Movement.find({
        //                         where: {
        //                             movement_order: passengerLogs[i].get().movement_order,
        //                             quote_id: quote_id
        //                         },
        //                         attributes: ['collection_address', 'destination_address']
        //                     })
        //                     // console.log(movement)
        //                 passengerLogs[i].address = {
        //                     collection: movement.get().collection_address,
        //                     destination: movement.get().destination_address
        //                 }
        //             }
        //             resolve(passengerLogs)
        //         }
        //     })
        globalDB.JobPassengers.findAll({
                where: {
                    point_id: {
                        $eq: point_id
                    },
                    passenger_id: {
                        $eq: passenger_id
                    },
                    quote_id: {
                        $eq: quote_id
                    },
                    pickup: {
                        $eq: pickup
                    }
                },
                limit: 1
            })
            .then(async(jobPassenger) => {
                console.log(jobPassenger)
                if (jobPassenger.length > 0) {
                    var type_code = 0
                    var jobPassengerItem = jobPassenger[0].get()
                    if (jobPassengerItem.pickup == 1) {
                        if (jobPassengerItem.point_id != jobPassengerItem.action_point_id && jobPassengerItem.action_point_id != 0 && (jobPassengerItem.status == 1 || jobPassengerItem.status == -1)) {
                            type_code = 3
                        } else if (jobPassengerItem.point_id == jobPassengerItem.action_point_id && jobPassengerItem.action_point_id != 0 && jobPassengerItem.status == 1) {
                            type_code = 2
                        }
                    } else if (jobPassengerItem.pickup == 0) {
                        if (jobPassengerItem.point_id != jobPassengerItem.action_point_id && jobPassengerItem.action_point_id != 0 && jobPassengerItem.status == 1) {
                            type_code = 5
                        } else if (jobPassengerItem.point_id == jobPassengerItem.action_point_id && jobPassengerItem.action_point_id != 0 && jobPassengerItem.status == 1) {
                            type_code = 4
                        }
                    }

                    var passengerLog = {
                        log_type_code: type_code,
                        date_time_scan: jobPassenger[0].get().date_time_scan,
                        route_type: jobPassenger[0].get().pickup,
                        address: {}
                    }
                    var movement = await globalDB.Movement.find({
                            where: {
                                movement_id: point_id,
                                quote_id: quote_id
                            },
                            attributes: ['collection_address', 'destination_address']
                        })
                        // console.log(movement)
                    passengerLog.address = {
                        collection: movement.get().collection_address,
                        destination: movement.get().destination_address
                    }
                    jobPassenger[0].dataValues = Object.assign({}, jobPassenger[0].dataValues, passengerLog)
                    if (type_code != 0) {
                        resolve(jobPassenger)
                    } else {
                        resolve([])
                    }
                } else {
                    resolve([])
                }
            })
    })
}

const findExtraRoute = (quote_id, movement_start, movement_end) => {
    return new Promise((resolve, reject) => {
        globalDB.Movement.findAll({
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
        globalDB.Movement.find({
                attributes: attributes,
                include: [{
                    model: globalDB.MovementOptions,
                    as: 'tb_movement_option',
                    attributes: ['date_end'],
                    required: true
                }],
                where: {
                    movement_id: {
                        $eq: movement_id
                    }
                }
            })
            .then((movement) => {
                console.log('movement:' + movement_id, movement)
                resolve(movement)
            })
            .catch((err) => console.log(err.message))
    })
}

const resolvers = {
    Query: {
        parentGlobalSelect(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_PARENT_GLOBAL')) {
                return null
            }
            var database = sequelizeInitial('ecm_share')
            return database.ParentGlobal.find({
                where: args
            })
        },
        async parent(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_PARENT')) {
                return null
            }
            var result = []
            for (let i = 0; i < request.user.databases.length; i++) {
                var schoolDB = sequelizeInitial(request.user.databases[i])
                var parentData = await schoolDB.Parent.find({
                    attributes: ['account'],
                    where: args
                })
                var accountData = await schoolDB.Account.find({
                    where: {
                        account_id: parentData.get().account
                    }
                })
                result.push({
                    school_name: accountData.get().name,
                    parent: parentData.get()
                })
                schoolDB = null
            }
            return result
                // return Parent.find({ where: args })
        },
        async parentPassengers(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_PARENT_PASSENGERS')) {
                return null
            }
            try {
                var result = []
                for (let i = 0; i < request.user.databases.length; i++) {
                    var schoolDB = sequelizeInitial(request.user.databases[i])
                    var parentData = await schoolDB.Parent.find({
                        attributes: ['parent_id', 'account'],
                        where: {
                            email: request.user.email
                        }
                    })
                    if (parentData == null) {
                        console.log('parent data null')
                        return null
                    }
                    var passengerData = await schoolDB.Passengers.findAll({
                        include: [{
                            model: schoolDB.ParentPassenger,
                            where: {
                                parent_id: parentData.get().parent_id
                            },
                            order: [
                                ['first_name', 'ASC']
                            ]
                        }]
                    })
                    var accountData = await schoolDB.Account.find({
                        where: {
                            account_id: parentData.get().account
                        }
                    })
                    for (let i = 0; i < passengerData.length; i++) {
                        passengerData[i].routeToday = []
                        var quote = await schoolDB.Quote.find({
                                attributes: ['quote_id'],
                                include: [{
                                    attributes: [],
                                    model: schoolDB.JobPassengers,
                                    required: true
                                }],
                                where: {
                                    date_out: {
                                        $between: [moment().format('YYYY-MM-DD') + ' 00:00:00', moment().format('YYYY-MM-DD') + ' 23:59:59']
                                    },
                                    account: {
                                        $eq: accountData.get().account_id
                                    },
                                    status_re: {
                                        $ne: 'E'
                                    }
                                },
                            })
                            // console.log(quote)
                        if (quote == null) {
                            console.log('quote data null')
                            continue;
                        }
                        var jobs = await schoolDB.JobPassengers.findAll({
                                attributes: ['quote_id', 'point_id', 'pickup', 'passenger_id', 'j_id'],
                                where: {
                                    quote_id: {
                                        $eq: quote.quote_id
                                    },
                                    passenger_id: passengerData[i].passenger_id
                                }
                            })
                            // console.log(jobs)
                        if (jobs == null) {
                            console.log('jobs data null')
                            continue
                        }
                        globalDB = schoolDB
                        var jobData = jobs.map((job) => job.get())
                        var jobDataPickUp = jobData.filter((job) => job.pickup == 1)
                        var jobDataDropOff = jobData.filter((job) => job.pickup == 0)
                        var journeys = []
                            // console.log(passengerData[i].passenger_id)
                        if (jobDataPickUp.length > 0 && jobDataDropOff.length > 0) {
                            for (let j = 0; j < jobDataPickUp.length; j++) {
                                var journeyData = await makeJourney(jobDataPickUp[j], jobDataDropOff[j])
                                var col_passenger_log = await findPassengerLog(jobDataPickUp[j])
                                var des_passenger_log = await findPassengerLog(jobDataDropOff[j])
                                console.log('col_passenger', col_passenger_log)
                                console.log('des_passenger', des_passenger_log)
                                journeyData.collection_address.passenger_log = (col_passenger_log.length > 0) ? col_passenger_log.map((item) => item.get()) : []
                                journeyData.destination_address.passenger_log = (des_passenger_log) ? des_passenger_log.map((item) => item.get()) : []
                                journeyData.collection_address.time_start = moment(journeyData.collection_address.time_start, 'HH:mm:ss').format('HH:mm')
                                var datetime_start = moment(`${journeyData.collection_address.date_start} ${journeyData.collection_address.time_start}`, 'YYYY-MM-DD HH:mm').subtract(2, 'hour').utc()
                                var datetime_end = moment(`${journeyData.destination_address.date_start} ${journeyData.destination_address.time_end}`, 'YYYY-MM-DD HH:mm').utc()
                                if (moment().isBetween(datetime_start, datetime_end)) {
                                    journeyData.peroid = 'current'
                                } else if (moment().isBefore(datetime_start)) {
                                    journeyData.peroid = 'next'
                                } else if (moment().isAfter(datetime_end)) {
                                    journeyData.peroid = 'previous'
                                }
                                journeyData.j_id = jobDataPickUp[j].j_id
                                journeyData.date_today = moment().format('DD/MM/YYYY')
                                journeyData.tracking = await schoolDB.Tracking.find({
                                        order: [
                                            ['track_id', 'DESC']
                                        ],
                                        attributes: ['lat', 'lng', 'timestamp', 'j_id'],
                                        where: {
                                            j_id: {
                                                $eq: jobDataPickUp[j].j_id
                                            }
                                        }
                                    })
                                    // console.log(journeyData)
                                passengerData[i].routeToday.push(journeyData)
                            }
                        }

                    }
                    result.push({
                        school_name: accountData.get().name,
                        passengers: passengerData
                    })
                    schoolDB = null
                }
                return result
            } catch (err) {
                console.log(err)
                return null
            }

        },
        async schoolContact(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_SCHOOL_CONTACT')) {
                return null
            }
            var result = []
            for (let i = 0; i < request.user.databases.length; i++) {
                var schoolDB = sequelizeInitial(request.user.databases[i])
                var parentData = await schoolDB.Parent.find({
                    attributes: ['account'],
                    where: {
                        email: request.user.email
                    }
                })
                var accountData = await schoolDB.Account.find({
                    where: {
                        account_id: parentData.get().account
                    }
                })
                result.push(accountData.get())
            }
            return result
        },
        async parentContactOptions(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_CONTACT_OPTIONS')) {
                return null
            }
            var database = sequelizeInitial('ecm_share')
            return database.ParentGlobal.find({
                attributes: ['accept_email', 'accept_notification'],
                where: {
                    email: request.user.email
                }
            })
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
            var shareDB = sequelizeInitial('ecm_share')
            try {
                var parentUpdate = await shareDB.ParentGlobal.update({ password: args.input['password'] }, { where: { email: args.input['email'], id: request.user.id } })
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
            var shareDB = sequelizeInitial('ecm_share')
            try {
                var parentTokenCreate = await shareDB.ParentToken.create({
                    push_token: args.input['push_token'],
                    parent_id: request.user.id
                })
                return { msg: 'New token has been added', status: true }
            } catch (err) {
                return { msg: err.message, status: false }
            }
        },
        async parentPushTokenDelete(_, args, request) {
            if (!checkPermission(request.user.mutate, 'DELETE_PUSH_TOKEN')) {
                return {
                    msg: "Your token is operation not permit",
                    status: false
                }
            }
            var shareDB = sequelizeInitial('ecm_share')
            try {
                var parentTokenDelete = await shareDB.ParentToken.destroy({
                    where: {
                        push_token: args.input['push_token'],
                        parent_id: request.user.id
                    }
                })
                return { msg: 'token has been deleted', status: true }
            } catch (err) {
                return { msg: err.message, status: false }
            }
        },
        async parentUpdateContactOption(_, args, request) {
            if (!checkPermission(request.user.mutate, 'UPDATE_CONTACT_OPTION')) {
                return {
                    msg: "Your token is operation not permit",
                    status: false
                }
            }
            var shareDB = sequelizeInitial('ecm_share')
            try {
                var updateItem = {}
                updateItem[args.input['key']] = args.input['value']
                var parentContactOptionsUpdate = await shareDB.ParentGlobal.update(updateItem, { where: { id: request.user.id } })
                return { msg: args.input['key'] + ' has been updated', status: true }
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