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
        var shareDB, parentGlobal, parentDetail, databases, companiesLogo, i, DB, account, companyLogo, result;
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
                            _context.next = 30;
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
                        databases = parentDetail.map(function (item) {
                            return item.get().database_name;
                        });
                        companiesLogo = [];
                        i = 0;

                    case 11:
                        if (!(i < databases.length)) {
                            _context.next = 26;
                            break;
                        }

                        DB = (0, _connector.sequelizeInitial)(databases[i]);

                        console.log(databases[i]);
                        _context.next = 16;
                        return DB.Parent.find({
                            attributes: ['account'],
                            where: {
                                email: parentGlobal.get().email
                            }
                        });

                    case 16:
                        account = _context.sent;

                        console.log(account);

                        if (!(account != null)) {
                            _context.next = 23;
                            break;
                        }

                        _context.next = 21;
                        return DB.Account.find({
                            attributes: ['name', 'company_logo'],
                            where: {
                                account_id: account.get().account
                            }
                        });

                    case 21:
                        companyLogo = _context.sent;

                        companiesLogo.push({
                            companyName: companyLogo.get().name,
                            logo: companyLogo.get().company_logo
                        });

                    case 23:
                        i++;
                        _context.next = 11;
                        break;

                    case 26:
                        result = Object.assign({}, parentGlobal.get(), { databases: databases, companiesLogo: companiesLogo });
                        return _context.abrupt('return', done(null, result));

                    case 30:
                        return _context.abrupt('return', done(null, null, { message: 'Invalid username or password.' }));

                    case 31:
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
        var shareDB, parentGlobal, parentDetail, databases, companiesLogo, i, DB, account, companyLogo, result;
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
                        databases = parentDetail.map(function (item) {
                            return item.get().database_name;
                        });
                        companiesLogo = [];
                        i = 0;

                    case 10:
                        if (!(i < databases.length)) {
                            _context2.next = 23;
                            break;
                        }

                        DB = (0, _connector.sequelizeInitial)(databases[i]);
                        _context2.next = 14;
                        return DB.Parent.find({
                            attributes: ['account_id'],
                            where: {
                                email: parentGlobal.get().email
                            }
                        });

                    case 14:
                        account = _context2.sent;

                        if (!(account.length > 0)) {
                            _context2.next = 20;
                            break;
                        }

                        _context2.next = 18;
                        return DB.Account.find({
                            attributes: ['name', 'company_logo'],
                            where: {
                                account_id: account.get().account_id
                            }
                        });

                    case 18:
                        companyLogo = _context2.sent;

                        companiesLogo.push({
                            companyName: companyLogo.get().name,
                            logo: companyLogo.get().company_logo
                        });

                    case 20:
                        i++;
                        _context2.next = 10;
                        break;

                    case 23:
                        result = Object.assign({}, parentGlobal.get(), { databases: databases, companiesLogo: companiesLogo });
                        return _context2.abrupt('return', done(err, result));

                    case 25:
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