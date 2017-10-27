'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _connector = require('./data/connector');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalStrategy = require('passport-local').Strategy;
// import { Parent } from './data/connector';

var crypto = require('crypto');

_passport2.default.use('local', new LocalStrategy(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(username, password, done) {
        var shareDB, parentGlobal, parentDetail, result;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        shareDB = (0, _connector.sequelizeInitial)('ecm_share');
                        _context.next = 3;
                        return shareDB.ParentGlobal.find({
                            attributes: ['id', 'email', 'phone'],
                            where: {
                                email: username,
                                password: crypto.createHash('md5').update(password).digest('hex')
                            }
                        });

                    case 3:
                        parentGlobal = _context.sent;

                        if (!(parentGlobal != null)) {
                            _context.next = 12;
                            break;
                        }

                        _context.next = 7;
                        return shareDB.ParentDetail.findAll({
                            where: {
                                parent_id: parentGlobal.get().id
                            }
                        });

                    case 7:
                        parentDetail = _context.sent;
                        result = Object.assign({}, parentGlobal.get(), { databases: parentDetail.map(function (item) {
                                return item.get().database_name;
                            }) });
                        return _context.abrupt('return', done(null, result));

                    case 12:
                        return _context.abrupt('return', done(null, null, { message: 'Invalid username or password.' }));

                    case 13:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}()));
_passport2.default.serializeUser(function (user, done) {
    done(null, user.id);
});
_passport2.default.deserializeUser(function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(id, done) {
        var shareDB, parentGlobal, parentDetail, result;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        shareDB = (0, _connector.sequelizeInitial)('ecm_share');
                        _context2.next = 3;
                        return shareDB.ParentGlobal.find({
                            attributes: ['id', 'email', 'phone'],
                            where: {
                                email: username,
                                password: crypto.createHash('md5').update(password).digest('hex')
                            }
                        });

                    case 3:
                        parentGlobal = _context2.sent;
                        _context2.next = 6;
                        return shareDB.ParentDetail.findAll({
                            where: {
                                parent_id: parentGlobal.get().id
                            }
                        });

                    case 6:
                        parentDetail = _context2.sent;
                        result = Object.assign({}, parentGlobal.get(), { databases: parentDetail.map(function (item) {
                                return item.get().database_name;
                            }) });
                        return _context2.abrupt('return', done(err, result));

                    case 9:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x4, _x5) {
        return _ref2.apply(this, arguments);
    };
}()
// return done(err, parentGlobal.get());
// Parent.find({
//         attributes: ['parent_id', 'gender', 'parent_name', 'phone_m', 'email'],
//         where: {
//             parent_id: {
//                 $eq: id
//             }
//         }
//     })
//     .then((parent, err) => {

//     })
);
//# sourceMappingURL=auth.js.map