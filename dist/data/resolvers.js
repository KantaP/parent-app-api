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

// import Sequelize from 'sequelize'
var crypto = require('crypto');
// import { Kind } from 'graphql/language';

var jwt = require('jsonwebtoken');

var checkPermission = function checkPermission(userPermissions, permission) {
    var check = userPermissions.filter(function (item) {
        return item == permission || item == 'ALL';
    });
    if (check.length > 0) return true;else return false;
};

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
                        collection_address_data = _context.sent;
                        _context.next = 6;
                        return findMovementData(dropOffArr['point_id'], ['date_start', 'time_start', 'destination_address', 'progress', 'des_lat', 'des_lng', 'movement_order']);

                    case 6:
                        destination_address_data = _context.sent;

                        response = (0, _extends3.default)({}, response, {
                            collection_address: Object.assign({}, collection_address_data.get(), {
                                time_end: (0, _moment2.default)(collection_address_data.get().tb_movement_option.get().date_end).utc().format('HH:mm'),
                                address: collection_address_data.get().collection_address,
                                latlng: collection_address_data.get().add_lat + ',' + collection_address_data.get().add_lng
                            })
                        });
                        response = (0, _extends3.default)({}, response, {
                            destination_address: Object.assign({}, destination_address_data.get(), {
                                time_end: (0, _moment2.default)(destination_address_data.get().tb_movement_option.get().date_end).utc().format('HH:mm'),
                                address: destination_address_data.get().destination_address,
                                latlng: destination_address_data.get().des_lat + ',' + destination_address_data.get().des_lng
                            })
                        });
                        _context.next = 11;
                        return findExtraRoute(pickUpArr.quote_id, collection_address_data.get().movement_order, destination_address_data.get().movement_order);

                    case 11:
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

                    case 14:
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
        quote_id = _ref2.quote_id;

    return new Promise(function (resolve, reject) {
        _connector.PassengerLog.findAll({
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
            order: [['log_id', 'DESC']],
            limit: 1
        }).then(function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(passengerLogs) {
                var i, movement;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(passengerLogs == null)) {
                                    _context2.next = 4;
                                    break;
                                }

                                resolve(null);
                                _context2.next = 14;
                                break;

                            case 4:
                                i = 0;

                            case 5:
                                if (!(i < passengerLogs.length)) {
                                    _context2.next = 13;
                                    break;
                                }

                                _context2.next = 8;
                                return _connector.Movement.find({
                                    where: {
                                        movement_order: passengerLogs[i].get().movement_order,
                                        quote_id: quote_id
                                    },
                                    attributes: ['collection_address', 'destination_address']
                                });

                            case 8:
                                movement = _context2.sent;

                                // console.log(movement)
                                passengerLogs[i].address = {
                                    collection: movement.get().collection_address,
                                    destination: movement.get().destination_address
                                };

                            case 10:
                                i++;
                                _context2.next = 5;
                                break;

                            case 13:
                                resolve(passengerLogs);

                            case 14:
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
        _connector.Movement.findAll({
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
        _connector.Movement.find({
            attributes: attributes,
            include: [{
                model: _connector.MovementOptions,
                as: 'tb_movement_option',
                attributes: ['date_end']
            }],
            where: {
                movement_id: {
                    $eq: movement_id
                }
            }
        }).then(function (movement) {
            resolve(movement);
        }).catch(function (err) {
            return console.log(err.message);
        });
    });
};

var resolvers = {
    Query: {
        parents: function parents(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_PARENTS')) {
                return null;
            }
            return _connector.Parent.findAll();
        },
        parent: function parent(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_PARENT')) {
                return null;
            }
            return _connector.Parent.find({ where: args });
        },
        parentPassenger: function parentPassenger(_, args, request) {
            if (!checkPermission(request.user.query, 'SELECT_PARENT_PASSENGER')) {
                return null;
            }
            // return ParentPassenger.find({ where: args })
            return _connector.Passengers.findAll({
                include: [{
                    model: _connector.ParentPassenger,
                    where: args
                }]
            });
        },
        passengerRouteToday: function passengerRouteToday(_, args, request) {
            var _this = this;

            return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
                var parentPassenger, quote, jobs, jobData, jobDataPickUp, jobDataDropOff, journeys, i, journeyData, col_passenger_log, des_passenger_log, datetime_start, datetime_end;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (checkPermission(request.user.query, 'SELECT_PASSENGER_ROUTE_TODAY')) {
                                    _context3.next = 2;
                                    break;
                                }

                                return _context3.abrupt('return', null);

                            case 2:
                                _context3.next = 4;
                                return _connector.ParentPassenger.find({
                                    attributes: [],
                                    include: [{
                                        model: _connector.Passengers,
                                        where: {
                                            passenger_id: args['passenger_id']
                                        },
                                        attributes: ['account']
                                    }]
                                });

                            case 4:
                                parentPassenger = _context3.sent;

                                if (!(parentPassenger == null)) {
                                    _context3.next = 7;
                                    break;
                                }

                                return _context3.abrupt('return', null);

                            case 7:
                                _context3.next = 9;
                                return _connector.Quote.find({
                                    attributes: ['quote_id'],
                                    include: [{
                                        attributes: [],
                                        model: _connector.JobPassengers,
                                        required: true
                                    }],
                                    where: {
                                        date_out: {
                                            $between: [(0, _moment2.default)().format('YYYY-MM-DD') + ' 00:00:00', (0, _moment2.default)().format('YYYY-MM-DD') + ' 23:59:59']
                                        },
                                        account: {
                                            $eq: parentPassenger.get().tb_passenger.get().account
                                        },
                                        status_re: {
                                            $ne: 'E'
                                        }
                                    }
                                });

                            case 9:
                                quote = _context3.sent;

                                if (!(quote == null)) {
                                    _context3.next = 12;
                                    break;
                                }

                                return _context3.abrupt('return', null);

                            case 12:
                                _context3.next = 14;
                                return _connector.JobPassengers.findAll({
                                    attributes: ['quote_id', 'point_id', 'pickup', 'passenger_id', 'j_id'],
                                    where: {
                                        quote_id: {
                                            $eq: quote.get().quote_id
                                        },
                                        passenger_id: args['passenger_id']
                                    }
                                });

                            case 14:
                                jobs = _context3.sent;

                                if (!(jobs == null)) {
                                    _context3.next = 17;
                                    break;
                                }

                                return _context3.abrupt('return', null);

                            case 17:
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

                                if (!(jobDataPickUp.length > 0 && jobDataDropOff.length > 0)) {
                                    _context3.next = 51;
                                    break;
                                }

                                i = 0;

                            case 23:
                                if (!(i < jobDataPickUp.length)) {
                                    _context3.next = 48;
                                    break;
                                }

                                _context3.next = 26;
                                return makeJourney(jobDataPickUp[i], jobDataDropOff[i]);

                            case 26:
                                journeyData = _context3.sent;
                                _context3.next = 29;
                                return findPassengerLog(jobDataPickUp[i]);

                            case 29:
                                col_passenger_log = _context3.sent;
                                _context3.next = 32;
                                return findPassengerLog(jobDataDropOff[i]);

                            case 32:
                                des_passenger_log = _context3.sent;

                                journeyData.collection_address.passenger_log = col_passenger_log.length > 0 ? col_passenger_log.map(function (item) {
                                    return item.get();
                                }) : [];
                                journeyData.destination_address.passenger_log = des_passenger_log ? des_passenger_log.map(function (item) {
                                    return item.get();
                                }) : [];
                                journeyData.collection_address.time_start = (0, _moment2.default)(journeyData.collection_address.time_start, 'HH:mm:ss').format('HH:mm');
                                datetime_start = (0, _moment2.default)(journeyData.collection_address.date_start + ' ' + journeyData.collection_address.time_start, 'YYYY-MM-DD HH:mm').utc();
                                datetime_end = (0, _moment2.default)(journeyData.destination_address.date_start + ' ' + journeyData.destination_address.time_end, 'YYYY-MM-DD HH:mm').utc();

                                if ((0, _moment2.default)().isBetween(datetime_start, datetime_end)) {
                                    journeyData.peroid = 'current';
                                } else if ((0, _moment2.default)().isBefore(datetime_start)) {
                                    journeyData.peroid = 'next';
                                } else if ((0, _moment2.default)().isAfter(datetime_end)) {
                                    journeyData.peroid = 'previous';
                                }
                                journeyData.j_id = jobDataPickUp[i].j_id;
                                journeyData.date_today = (0, _moment2.default)().format('DD/MM/YYYY');
                                _context3.next = 43;
                                return _connector.Tracking.find({
                                    order: [['track_id', 'DESC']],
                                    attributes: ['lat', 'lng', 'timestamp', 'j_id'],
                                    where: {
                                        j_id: {
                                            $eq: jobDataPickUp[i].j_id
                                        }
                                    }
                                });

                            case 43:
                                journeyData.tracking = _context3.sent;

                                journeys.push(journeyData);

                            case 45:
                                i++;
                                _context3.next = 23;
                                break;

                            case 48:
                                return _context3.abrupt('return', journeys);

                            case 51:
                                return _context3.abrupt('return', null);

                            case 52:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, _this);
            }))();
        },
        passengerByQuote: function passengerByQuote(_, args, request) {
            var _this2 = this;

            return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
                var jobPassenger, result;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (checkPermission(request.user.query, 'SELECT_PASSENGER_BY_QUOTE')) {
                                    _context4.next = 2;
                                    break;
                                }

                                return _context4.abrupt('return', null);

                            case 2:
                                _context4.next = 4;
                                return _connector.Movement.findAll({
                                    where: args,
                                    attributes: ['collection_address', 'destination_address', 'movement_id'],
                                    include: [{
                                        model: _connector.JobPassengers,
                                        attributes: ['passenger_id', 'pickup'],
                                        include: [{
                                            model: _connector.Passengers,
                                            attributes: ['first_name']
                                        }]
                                    }],
                                    order: [['movement_id', 'ASC']]
                                });

                            case 4:
                                jobPassenger = _context4.sent;
                                result = [];

                                jobPassenger.forEach(function (item) {
                                    result.push({
                                        movement_id: item.get().movement_id,
                                        collection: item.get().collection_address,
                                        destination: item.get().destination_address,
                                        pickup: item.get().tb_job_passengers.filter(function (job) {
                                            return job.pickup == 1;
                                        }).map(function (item2) {
                                            item2.passenger = item2.get().tb_passenger.get();
                                            return item2;
                                        }),
                                        dropoff: item.get().tb_job_passengers.filter(function (job) {
                                            return job.pickup == 0;
                                        }).map(function (item2) {
                                            item2.passenger = item2.get().tb_passenger.get();
                                            return item2;
                                        })
                                    });
                                });
                                return _context4.abrupt('return', result);

                            case 8:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, _this2);
            }))();
        },
        watchTracking: function watchTracking(_, args, request) {
            var _this3 = this;

            return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
                var tracking;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (checkPermission(request.user.query, 'SELECT_WATCH_TRACKING')) {
                                    _context5.next = 2;
                                    break;
                                }

                                return _context5.abrupt('return', null);

                            case 2:
                                _context5.next = 4;
                                return _connector.Tracking.find({
                                    order: [['track_id', 'DESC']],
                                    attributes: ['lat', 'lng', 'timestamp', 'j_id'],
                                    where: args
                                });

                            case 4:
                                tracking = _context5.sent;
                                return _context5.abrupt('return', tracking);

                            case 6:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, _this3);
            }))();
        },
        companyContact: function companyContact(_, args, request) {
            var _this4 = this;

            return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
                var company;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                if (checkPermission(request.user.query, 'SELECT_COMPANY_DATA')) {
                                    _context6.next = 2;
                                    break;
                                }

                                return _context6.abrupt('return', null);

                            case 2:
                                _context6.next = 4;
                                return _connector.Company.find({
                                    where: {
                                        main_profile: {
                                            $eq: 1
                                        }
                                    }
                                });

                            case 4:
                                company = _context6.sent;

                                company.address = company.address.replace(/(?:\\[rn])+/g, " ");
                                return _context6.abrupt('return', company);

                            case 7:
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
                var parentUpdate;
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
                                _context7.prev = 3;
                                _context7.next = 6;
                                return _connector.Parent.update({ password: args.input['password'] }, { where: { email: args.input['email'], parent_id: request.user.id } });

                            case 6:
                                parentUpdate = _context7.sent;
                                return _context7.abrupt('return', {
                                    msg: "Password has been updated",
                                    status: true
                                });

                            case 10:
                                _context7.prev = 10;
                                _context7.t0 = _context7['catch'](3);
                                return _context7.abrupt('return', {
                                    msg: _context7.t0.message,
                                    status: false
                                });

                            case 13:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, _this5, [[3, 10]]);
            }))();
        },
        parentPushTokenCreate: function parentPushTokenCreate(_, args, request) {
            var _this6 = this;

            return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8() {
                var parent, parentTokenCreate;
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
                                _context8.next = 4;
                                return _connector.Parent.find({
                                    where: {
                                        email: args.input['email']
                                    }
                                });

                            case 4:
                                parent = _context8.sent;

                                if (!(parent == null)) {
                                    _context8.next = 7;
                                    break;
                                }

                                return _context8.abrupt('return', { msg: 'Not found parent data.', status: false });

                            case 7:
                                _context8.prev = 7;
                                _context8.next = 10;
                                return _connector.ParentToken.create({
                                    parent_id: parent.get().parent_id,
                                    token: args.input['push_token']
                                });

                            case 10:
                                parentTokenCreate = _context8.sent;
                                return _context8.abrupt('return', { msg: 'New token has been added', status: true });

                            case 14:
                                _context8.prev = 14;
                                _context8.t0 = _context8['catch'](7);
                                return _context8.abrupt('return', { msg: _context8.t0.message, status: false });

                            case 17:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, _this6, [[7, 14]]);
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