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
        globalDB.PassengerLog.findAll({
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
                                return globalDB.Movement.find({
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
                var result, i, schoolDB, parentData, passengerData, accountData, _i, quote, jobs, jobData, jobDataPickUp, jobDataDropOff, journeys, _i2, journeyData, col_passenger_log, des_passenger_log, datetime_start, datetime_end;

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
                                result = [];
                                i = 0;

                            case 4:
                                if (!(i < request.user.databases.length)) {
                                    _context4.next = 68;
                                    break;
                                }

                                schoolDB = (0, _connector.sequelizeInitial)(request.user.databases[i]);
                                _context4.next = 8;
                                return schoolDB.Parent.find({
                                    attributes: ['parent_id', 'account'],
                                    where: {
                                        email: request.user.email
                                    }
                                });

                            case 8:
                                parentData = _context4.sent;
                                _context4.next = 11;
                                return schoolDB.Passengers.findAll({
                                    include: [{
                                        model: schoolDB.ParentPassenger,
                                        where: {
                                            parent_id: parentData.get().parent_id
                                        }
                                    }]
                                });

                            case 11:
                                passengerData = _context4.sent;
                                _context4.next = 14;
                                return schoolDB.Account.find({
                                    where: {
                                        account_id: parentData.get().account
                                    }
                                });

                            case 14:
                                accountData = _context4.sent;
                                _i = 0;

                            case 16:
                                if (!(_i < passengerData.length)) {
                                    _context4.next = 63;
                                    break;
                                }

                                passengerData[_i].routeToday = [];
                                _context4.next = 20;
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

                            case 20:
                                quote = _context4.sent;

                                if (!(quote == null)) {
                                    _context4.next = 23;
                                    break;
                                }

                                return _context4.abrupt('continue', 60);

                            case 23:
                                _context4.next = 25;
                                return schoolDB.JobPassengers.findAll({
                                    attributes: ['quote_id', 'point_id', 'pickup', 'passenger_id', 'j_id'],
                                    where: {
                                        quote_id: {
                                            $eq: quote.quote_id
                                        },
                                        passenger_id: passengerData[_i].passenger_id
                                    }
                                });

                            case 25:
                                jobs = _context4.sent;

                                if (!(jobs == null)) {
                                    _context4.next = 28;
                                    break;
                                }

                                return _context4.abrupt('continue', 60);

                            case 28:
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

                                if (!(jobDataPickUp.length > 0 && jobDataDropOff.length > 0)) {
                                    _context4.next = 60;
                                    break;
                                }

                                _i2 = 0;

                            case 35:
                                if (!(_i2 < jobDataPickUp.length)) {
                                    _context4.next = 60;
                                    break;
                                }

                                _context4.next = 38;
                                return makeJourney(jobDataPickUp[_i2], jobDataDropOff[_i2]);

                            case 38:
                                journeyData = _context4.sent;
                                _context4.next = 41;
                                return findPassengerLog(jobDataPickUp[_i2]);

                            case 41:
                                col_passenger_log = _context4.sent;
                                _context4.next = 44;
                                return findPassengerLog(jobDataDropOff[_i2]);

                            case 44:
                                des_passenger_log = _context4.sent;

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
                                journeyData.j_id = jobDataPickUp[_i2].j_id;
                                journeyData.date_today = (0, _moment2.default)().format('DD/MM/YYYY');
                                _context4.next = 55;
                                return schoolDB.Tracking.find({
                                    order: [['track_id', 'DESC']],
                                    attributes: ['lat', 'lng', 'timestamp', 'j_id'],
                                    where: {
                                        j_id: {
                                            $eq: jobDataPickUp[_i2].j_id
                                        }
                                    }
                                });

                            case 55:
                                journeyData.tracking = _context4.sent;

                                passengerData[_i2].routeToday.push(journeyData);

                            case 57:
                                _i2++;
                                _context4.next = 35;
                                break;

                            case 60:
                                _i++;
                                _context4.next = 16;
                                break;

                            case 63:
                                result.push({
                                    school_name: accountData.get().name,
                                    passengers: passengerData
                                });
                                schoolDB = null;

                            case 65:
                                i++;
                                _context4.next = 4;
                                break;

                            case 68:
                                return _context4.abrupt('return', result);

                            case 69:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, _this2);
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
        }
    },
    Mutation: {
        parentPasswordUpdate: function parentPasswordUpdate(_, args, request) {
            var _this4 = this;

            return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
                var shareDB, parentUpdate;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                if (checkPermission(request.user.mutate, 'UPDATE_PASSWORD')) {
                                    _context6.next = 2;
                                    break;
                                }

                                return _context6.abrupt('return', {
                                    msg: "Your token is operation not permit",
                                    status: false
                                });

                            case 2:
                                args.input['password'] = crypto.createHash('md5').update(args.input['password']).digest('hex');
                                shareDB = (0, _connector.sequelizeInitial)('ecm_share');
                                _context6.prev = 4;
                                _context6.next = 7;
                                return shareDB.ParentGlobal.update({ password: args.input['password'] }, { where: { email: args.input['email'], id: request.user.id } });

                            case 7:
                                parentUpdate = _context6.sent;
                                return _context6.abrupt('return', {
                                    msg: "Password has been updated",
                                    status: true
                                });

                            case 11:
                                _context6.prev = 11;
                                _context6.t0 = _context6['catch'](4);
                                return _context6.abrupt('return', {
                                    msg: _context6.t0.message,
                                    status: false
                                });

                            case 14:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, _this4, [[4, 11]]);
            }))();
        },
        parentPushTokenCreate: function parentPushTokenCreate(_, args, request) {
            var _this5 = this;

            return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
                var shareDB, parentTokenCreate;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                if (checkPermission(request.user.mutate, 'CREATE_PUSH_TOKEN')) {
                                    _context7.next = 2;
                                    break;
                                }

                                return _context7.abrupt('return', {
                                    msg: "Your token is operation not permit",
                                    status: false
                                });

                            case 2:
                                shareDB = (0, _connector.sequelizeInitial)('ecm_share');
                                _context7.prev = 3;
                                _context7.next = 6;
                                return shareDB.ParentToken.create({
                                    push_token: args.input['push_token'],
                                    parent_id: request.user.id
                                });

                            case 6:
                                parentTokenCreate = _context7.sent;
                                return _context7.abrupt('return', { msg: 'New token has been added', status: true });

                            case 10:
                                _context7.prev = 10;
                                _context7.t0 = _context7['catch'](3);
                                return _context7.abrupt('return', { msg: _context7.t0.message, status: false });

                            case 13:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, _this5, [[3, 10]]);
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