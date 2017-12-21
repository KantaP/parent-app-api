'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _connector = require('./connector');

var _graphql = require('graphql');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var checkPermission = function checkPermission(userPermissions, permission) {
    var check = userPermissions.filter(function (item) {
        return item == permission || item == 'ALL';
    });
    if (check.length > 0) return true;else return false;
};
var globalDB = null;
var makeJourney = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(pickUpArr, dropOffArr) {
        var response, collection_address_data, destination_address_data, extra_address_data;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        response = {
                            collection_address: {},
                            destination_address: {},
                            extra_address: []
                        };
                        _context.next = 3;
                        return findMovementData(pickUpArr['point_id'], ['date_start', 'time_start', 'collection_address', 'progress', 'add_lat', 'add_lng', 'movement_order']);

                    case 3:
                        _context.t0 = _context.sent;

                        if (_context.t0) {
                            _context.next = 6;
                            break;
                        }

                        _context.t0 = undefined;

                    case 6:
                        collection_address_data = _context.t0;
                        _context.next = 9;
                        return findMovementData(dropOffArr['point_id'], ['date_start', 'time_start', 'destination_address', 'progress', 'des_lat', 'des_lng', 'movement_order']);

                    case 9:
                        _context.t1 = _context.sent;

                        if (_context.t1) {
                            _context.next = 12;
                            break;
                        }

                        _context.t1 = undefined;

                    case 12:
                        destination_address_data = _context.t1;

                        response = (0, _extends3.default)({}, response, {
                            collection_address: Object.assign({}, collection_address_data ? collection_address_data.get() : {}, {
                                time_end: (0, _moment2.default)(collection_address_data.get().tb_movement_option.get().date_end).utc().format('HH:mm'),
                                address: collection_address_data.get().collection_address,
                                latlng: collection_address_data.get().add_lat + ',' + collection_address_data.get().add_lng
                            })
                        });
                        response = (0, _extends3.default)({}, response, {
                            destination_address: Object.assign({}, destination_address_data ? destination_address_data.get() : {}, {
                                time_end: (0, _moment2.default)(destination_address_data.get().tb_movement_option.get().date_end).utc().format('HH:mm'),
                                address: destination_address_data.get().destination_address,
                                latlng: destination_address_data.get().des_lat + ',' + destination_address_data.get().des_lng
                            })
                        });
                        _context.next = 17;
                        return findExtraRoute(pickUpArr.quote_id, collection_address_data.get().movement_order, destination_address_data.get().movement_order);

                    case 17:
                        extra_address_data = _context.sent;

                        response.extra_address = extra_address_data.filter(function (item) {
                            return item.get().movement_order > collection_address_data.get().movement_order;
                        }).map(function (extra) {
                            return {
                                movement_order: extra.get().movement_order,
                                latlng: extra.get().add_lat + ',' + extra.get().add_lng
                            };
                        });
                        return _context.abrupt('return', response);

                    case 20:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function makeJourney(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var findPassengerLog = function findPassengerLog(_ref2) {
    var point_id = _ref2.point_id,
        passenger_id = _ref2.passenger_id,
        quote_id = _ref2.quote_id,
        pickup = _ref2.pickup;

    return new Promise(function (resolve, reject) {
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
        }).then(function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(jobPassenger) {
                var type_code, jobPassengerItem, passengerLog, movement;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                console.log(jobPassenger);

                                if (!(jobPassenger.length > 0)) {
                                    _context2.next = 14;
                                    break;
                                }

                                type_code = 0;
                                jobPassengerItem = jobPassenger[0].get();

                                if (jobPassengerItem.pickup == 1) {
                                    if (jobPassengerItem.point_id != jobPassengerItem.action_point_id && jobPassengerItem.action_point_id != 0 && (jobPassengerItem.status == 1 || jobPassengerItem.status == -1)) {
                                        type_code = 3;
                                    } else if (jobPassengerItem.point_id == jobPassengerItem.action_point_id && jobPassengerItem.action_point_id != 0 && jobPassengerItem.status == 1) {
                                        type_code = 2;
                                    }
                                } else if (jobPassengerItem.pickup == 0) {
                                    if (jobPassengerItem.point_id != jobPassengerItem.action_point_id && jobPassengerItem.action_point_id != 0 && jobPassengerItem.status == 1) {
                                        type_code = 5;
                                    } else if (jobPassengerItem.point_id == jobPassengerItem.action_point_id && jobPassengerItem.action_point_id != 0 && jobPassengerItem.status == 1) {
                                        type_code = 4;
                                    }
                                }

                                passengerLog = {
                                    log_type_code: type_code,
                                    date_time_scan: jobPassenger[0].get().date_time_scan,
                                    route_type: jobPassenger[0].get().pickup,
                                    address: {}
                                };
                                _context2.next = 8;
                                return globalDB.Movement.find({
                                    where: {
                                        movement_id: point_id,
                                        quote_id: quote_id
                                    },
                                    attributes: ['collection_address', 'destination_address']
                                });

                            case 8:
                                movement = _context2.sent;

                                // console.log(movement)
                                passengerLog.address = {
                                    collection: movement.get().collection_address,
                                    destination: movement.get().destination_address
                                };
                                jobPassenger[0].dataValues = Object.assign({}, jobPassenger[0].dataValues, passengerLog);
                                if (type_code != 0) {
                                    resolve(jobPassenger);
                                } else {
                                    resolve([]);
                                }
                                _context2.next = 15;
                                break;

                            case 14:
                                resolve([]);

                            case 15:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, undefined);
            }));

            return function (_x3) {
                return _ref3.apply(this, arguments);
            };
        }());
    });
};

var findExtraRoute = function findExtraRoute(quote_id, movement_start, movement_end) {
    return new Promise(function (resolve, reject) {
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
        }).then(function (movements) {
            resolve(movements);
        });
    });
};

var findMovementData = function findMovementData(movement_id, attributes) {
    return new Promise(function (resolve, reject) {
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
        }).then(function (movement) {
            console.log('movement:' + movement_id, movement);
            resolve(movement);
        }).catch(function (err) {
            return console.log(err.message);
        });
    });
};

var resolvers = {
    Query: {
        parentGlobalSelect: function parentGlobalSelect(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_PARENT_GLOBAL')) {
                return null;
            }
            var database = (0, _connector.sequelizeInitial)('ecm_share');
            return database.ParentGlobal.find({
                where: args
            });
        },
        parent: function parent(_, args, request) {
            var _this = this;

            return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
                var result, i, schoolDB, parentData, accountData;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (checkPermission(request.user.query, 'SELECT_PARENT')) {
                                    _context3.next = 2;
                                    break;
                                }

                                return _context3.abrupt('return', null);

                            case 2:
                                result = [];
                                i = 0;

                            case 4:
                                if (!(i < request.user.databases.length)) {
                                    _context3.next = 17;
                                    break;
                                }

                                schoolDB = (0, _connector.sequelizeInitial)(request.user.databases[i]);
                                _context3.next = 8;
                                return schoolDB.Parent.find({
                                    attributes: ['account'],
                                    where: args
                                });

                            case 8:
                                parentData = _context3.sent;
                                _context3.next = 11;
                                return schoolDB.Account.find({
                                    where: {
                                        account_id: parentData.get().account
                                    }
                                });

                            case 11:
                                accountData = _context3.sent;

                                result.push({
                                    school_name: accountData.get().name,
                                    parent: parentData.get()
                                });
                                schoolDB = null;

                            case 14:
                                i++;
                                _context3.next = 4;
                                break;

                            case 17:
                                return _context3.abrupt('return', result);

                            case 18:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, _this);
            }))();
        },
        parentPassengers: function parentPassengers(_, args, request) {
            var _this2 = this;

            return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
                var result, i, schoolDB, parentData, passengerData, accountData, _i, quote, jobs, jobData, jobDataPickUp, jobDataDropOff, journeys, j, journeyData, col_passenger_log, des_passenger_log, datetime_start, datetime_end;

                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (checkPermission(request.user.query, 'SELECT_PARENT_PASSENGERS')) {
                                    _context4.next = 2;
                                    break;
                                }

                                return _context4.abrupt('return', null);

                            case 2:
                                _context4.prev = 2;
                                result = [];
                                i = 0;

                            case 5:
                                if (!(i < request.user.databases.length)) {
                                    _context4.next = 76;
                                    break;
                                }

                                schoolDB = (0, _connector.sequelizeInitial)(request.user.databases[i]);
                                _context4.next = 9;
                                return schoolDB.Parent.find({
                                    attributes: ['parent_id', 'account'],
                                    where: {
                                        email: request.user.email
                                    }
                                });

                            case 9:
                                parentData = _context4.sent;

                                if (!(parentData == null)) {
                                    _context4.next = 13;
                                    break;
                                }

                                console.log('parent data null');
                                return _context4.abrupt('return', null);

                            case 13:
                                _context4.next = 15;
                                return schoolDB.Passengers.findAll({
                                    include: [{
                                        model: schoolDB.ParentPassenger,
                                        where: {
                                            parent_id: parentData.get().parent_id
                                        },
                                        order: [['first_name', 'ASC']]
                                    }]
                                });

                            case 15:
                                passengerData = _context4.sent;
                                _context4.next = 18;
                                return schoolDB.Account.find({
                                    where: {
                                        account_id: parentData.get().account
                                    }
                                });

                            case 18:
                                accountData = _context4.sent;
                                _i = 0;

                            case 20:
                                if (!(_i < passengerData.length)) {
                                    _context4.next = 71;
                                    break;
                                }

                                passengerData[_i].routeToday = [];
                                _context4.next = 24;
                                return schoolDB.Quote.find({
                                    attributes: ['quote_id'],
                                    include: [{
                                        attributes: [],
                                        model: schoolDB.JobPassengers,
                                        required: true
                                    }],
                                    where: {
                                        date_out: {
                                            $between: [(0, _moment2.default)().format('YYYY-MM-DD') + ' 00:00:00', (0, _moment2.default)().format('YYYY-MM-DD') + ' 23:59:59']
                                        },
                                        account: {
                                            $eq: accountData.get().account_id
                                        },
                                        status_re: {
                                            $ne: 'E'
                                        }
                                    }
                                });

                            case 24:
                                quote = _context4.sent;

                                if (!(quote == null)) {
                                    _context4.next = 28;
                                    break;
                                }

                                console.log('quote data null');
                                return _context4.abrupt('continue', 68);

                            case 28:
                                _context4.next = 30;
                                return schoolDB.JobPassengers.findAll({
                                    attributes: ['quote_id', 'point_id', 'pickup', 'passenger_id', 'j_id'],
                                    where: {
                                        quote_id: {
                                            $eq: quote.quote_id
                                        },
                                        passenger_id: passengerData[_i].passenger_id
                                    }
                                });

                            case 30:
                                jobs = _context4.sent;

                                if (!(jobs == null)) {
                                    _context4.next = 34;
                                    break;
                                }

                                console.log('jobs data null');
                                return _context4.abrupt('continue', 68);

                            case 34:
                                globalDB = schoolDB;
                                jobData = jobs.map(function (job) {
                                    return job.get();
                                });
                                jobDataPickUp = jobData.filter(function (job) {
                                    return job.pickup == 1;
                                });
                                jobDataDropOff = jobData.filter(function (job) {
                                    return job.pickup == 0;
                                });
                                journeys = [];
                                // console.log(passengerData[i].passenger_id)

                                if (!(jobDataPickUp.length > 0 && jobDataDropOff.length > 0)) {
                                    _context4.next = 68;
                                    break;
                                }

                                j = 0;

                            case 41:
                                if (!(j < jobDataPickUp.length)) {
                                    _context4.next = 68;
                                    break;
                                }

                                _context4.next = 44;
                                return makeJourney(jobDataPickUp[j], jobDataDropOff[j]);

                            case 44:
                                journeyData = _context4.sent;
                                _context4.next = 47;
                                return findPassengerLog(jobDataPickUp[j]);

                            case 47:
                                col_passenger_log = _context4.sent;
                                _context4.next = 50;
                                return findPassengerLog(jobDataDropOff[j]);

                            case 50:
                                des_passenger_log = _context4.sent;

                                console.log('col_passenger', col_passenger_log);
                                console.log('des_passenger', des_passenger_log);
                                journeyData.collection_address.passenger_log = col_passenger_log.length > 0 ? col_passenger_log.map(function (item) {
                                    return item.get();
                                }) : [];
                                journeyData.destination_address.passenger_log = des_passenger_log ? des_passenger_log.map(function (item) {
                                    return item.get();
                                }) : [];
                                journeyData.collection_address.time_start = (0, _moment2.default)(journeyData.collection_address.time_start, 'HH:mm:ss').format('HH:mm');
                                datetime_start = (0, _moment2.default)(journeyData.collection_address.date_start + ' ' + journeyData.collection_address.time_start, 'YYYY-MM-DD HH:mm').subtract(2, 'hour').utc();
                                datetime_end = (0, _moment2.default)(journeyData.destination_address.date_start + ' ' + journeyData.destination_address.time_end, 'YYYY-MM-DD HH:mm').utc();

                                if ((0, _moment2.default)().isBetween(datetime_start, datetime_end)) {
                                    journeyData.peroid = 'current';
                                } else if ((0, _moment2.default)().isBefore(datetime_start)) {
                                    journeyData.peroid = 'next';
                                } else if ((0, _moment2.default)().isAfter(datetime_end)) {
                                    journeyData.peroid = 'previous';
                                }
                                journeyData.j_id = jobDataPickUp[j].j_id;
                                journeyData.date_today = (0, _moment2.default)().format('DD/MM/YYYY');
                                _context4.next = 63;
                                return schoolDB.Tracking.find({
                                    order: [['track_id', 'DESC']],
                                    attributes: ['lat', 'lng', 'timestamp', 'j_id'],
                                    where: {
                                        j_id: {
                                            $eq: jobDataPickUp[j].j_id
                                        }
                                    }
                                });

                            case 63:
                                journeyData.tracking = _context4.sent;

                                // console.log(journeyData)
                                passengerData[_i].routeToday.push(journeyData);

                            case 65:
                                j++;
                                _context4.next = 41;
                                break;

                            case 68:
                                _i++;
                                _context4.next = 20;
                                break;

                            case 71:
                                result.push({
                                    school_name: accountData.get().name,
                                    passengers: passengerData
                                });
                                schoolDB = null;

                            case 73:
                                i++;
                                _context4.next = 5;
                                break;

                            case 76:
                                return _context4.abrupt('return', result);

                            case 79:
                                _context4.prev = 79;
                                _context4.t0 = _context4['catch'](2);

                                console.log(_context4.t0);
                                return _context4.abrupt('return', null);

                            case 83:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, _this2, [[2, 79]]);
            }))();
        },
        schoolContact: function schoolContact(_, args, request) {
            var _this3 = this;

            return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
                var result, i, schoolDB, parentData, accountData;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (checkPermission(request.user.query, 'SELECT_SCHOOL_CONTACT')) {
                                    _context5.next = 2;
                                    break;
                                }

                                return _context5.abrupt('return', null);

                            case 2:
                                result = [];
                                i = 0;

                            case 4:
                                if (!(i < request.user.databases.length)) {
                                    _context5.next = 16;
                                    break;
                                }

                                schoolDB = (0, _connector.sequelizeInitial)(request.user.databases[i]);
                                _context5.next = 8;
                                return schoolDB.Parent.find({
                                    attributes: ['account'],
                                    where: {
                                        email: request.user.email
                                    }
                                });

                            case 8:
                                parentData = _context5.sent;
                                _context5.next = 11;
                                return schoolDB.Account.find({
                                    where: {
                                        account_id: parentData.get().account
                                    }
                                });

                            case 11:
                                accountData = _context5.sent;

                                result.push(accountData.get());

                            case 13:
                                i++;
                                _context5.next = 4;
                                break;

                            case 16:
                                return _context5.abrupt('return', result);

                            case 17:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, _this3);
            }))();
        },
        parentContactOptions: function parentContactOptions(_, args, request) {
            var _this4 = this;

            return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
                var database;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                if (checkPermission(request.user.query, 'SELECT_CONTACT_OPTIONS')) {
                                    _context6.next = 2;
                                    break;
                                }

                                return _context6.abrupt('return', null);

                            case 2:
                                database = (0, _connector.sequelizeInitial)('ecm_share');
                                return _context6.abrupt('return', database.ParentGlobal.find({
                                    attributes: ['accept_email', 'accept_notification'],
                                    where: {
                                        email: request.user.email
                                    }
                                }));

                            case 4:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, _this4);
            }))();
        }
    },
    Mutation: {
        parentPasswordUpdate: function parentPasswordUpdate(_, args, request) {
            var _this5 = this;

            return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
                var shareDB, parentUpdate;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                if (checkPermission(request.user.mutate, 'UPDATE_PASSWORD')) {
                                    _context7.next = 2;
                                    break;
                                }

                                return _context7.abrupt('return', {
                                    msg: "Your token is operation not permit",
                                    status: false
                                });

                            case 2:
                                args.input['password'] = crypto.createHash('md5').update(args.input['password']).digest('hex');
                                shareDB = (0, _connector.sequelizeInitial)('ecm_share');
                                _context7.prev = 4;
                                _context7.next = 7;
                                return shareDB.ParentGlobal.update({ password: args.input['password'] }, { where: { email: args.input['email'], id: request.user.id } });

                            case 7:
                                parentUpdate = _context7.sent;
                                return _context7.abrupt('return', {
                                    msg: "Password has been updated",
                                    status: true
                                });

                            case 11:
                                _context7.prev = 11;
                                _context7.t0 = _context7['catch'](4);
                                return _context7.abrupt('return', {
                                    msg: _context7.t0.message,
                                    status: false
                                });

                            case 14:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, _this5, [[4, 11]]);
            }))();
        },
        parentPushTokenCreate: function parentPushTokenCreate(_, args, request) {
            var _this6 = this;

            return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8() {
                var shareDB, parentTokenCreate;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                if (checkPermission(request.user.mutate, 'CREATE_PUSH_TOKEN')) {
                                    _context8.next = 2;
                                    break;
                                }

                                return _context8.abrupt('return', {
                                    msg: "Your token is operation not permit",
                                    status: false
                                });

                            case 2:
                                shareDB = (0, _connector.sequelizeInitial)('ecm_share');
                                _context8.prev = 3;
                                _context8.next = 6;
                                return shareDB.ParentToken.create({
                                    push_token: args.input['push_token'],
                                    parent_id: request.user.id
                                });

                            case 6:
                                parentTokenCreate = _context8.sent;
                                return _context8.abrupt('return', { msg: 'New token has been added', status: true });

                            case 10:
                                _context8.prev = 10;
                                _context8.t0 = _context8['catch'](3);
                                return _context8.abrupt('return', { msg: _context8.t0.message, status: false });

                            case 13:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, _this6, [[3, 10]]);
            }))();
        },
        parentPushTokenDelete: function parentPushTokenDelete(_, args, request) {
            var _this7 = this;

            return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9() {
                var shareDB, parentTokenDelete;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                if (checkPermission(request.user.mutate, 'DELETE_PUSH_TOKEN')) {
                                    _context9.next = 2;
                                    break;
                                }

                                return _context9.abrupt('return', {
                                    msg: "Your token is operation not permit",
                                    status: false
                                });

                            case 2:
                                shareDB = (0, _connector.sequelizeInitial)('ecm_share');
                                _context9.prev = 3;
                                _context9.next = 6;
                                return shareDB.ParentToken.destroy({
                                    where: {
                                        push_token: args.input['push_token'],
                                        parent_id: request.user.id
                                    }
                                });

                            case 6:
                                parentTokenDelete = _context9.sent;
                                return _context9.abrupt('return', { msg: 'token has been deleted', status: true });

                            case 10:
                                _context9.prev = 10;
                                _context9.t0 = _context9['catch'](3);
                                return _context9.abrupt('return', { msg: _context9.t0.message, status: false });

                            case 13:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, _this7, [[3, 10]]);
            }))();
        },
        parentUpdateContactOption: function parentUpdateContactOption(_, args, request) {
            var _this8 = this;

            return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10() {
                var shareDB, updateItem, parentContactOptionsUpdate;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                if (checkPermission(request.user.mutate, 'UPDATE_CONTACT_OPTION')) {
                                    _context10.next = 2;
                                    break;
                                }

                                return _context10.abrupt('return', {
                                    msg: "Your token is operation not permit",
                                    status: false
                                });

                            case 2:
                                shareDB = (0, _connector.sequelizeInitial)('ecm_share');
                                _context10.prev = 3;
                                updateItem = {};

                                updateItem[args.input['key']] = args.input['value'];
                                _context10.next = 8;
                                return shareDB.ParentGlobal.update(updateItem, { where: { id: request.user.id } });

                            case 8:
                                parentContactOptionsUpdate = _context10.sent;
                                return _context10.abrupt('return', { msg: args.input['key'] + ' has been updated', status: true });

                            case 12:
                                _context10.prev = 12;
                                _context10.t0 = _context10['catch'](3);
                                return _context10.abrupt('return', { msg: _context10.t0.message, status: false });

                            case 15:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, _this8, [[3, 12]]);
            }))();
        }
    },
    Date: new _graphql.GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue: function parseValue(value) {
            return (0, _moment2.default)(value); // value from the client
        },
        serialize: function serialize(value) {
            return (0, _moment2.default)(value).utc().format('DD-MM-YYYY HH:mm:ss'); // value sent to the client
        },
        parseLiteral: function parseLiteral(ast) {}
    })
};

exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map