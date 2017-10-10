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

var crypto = require('crypto');

_passport2.default.use('local', new LocalStrategy(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(username, password, done) {
        var checkPassword;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _connector.Parent.find({
                            attributes: ['parent_id', 'gender', 'parent_name', 'phone_m', 'email'],
                            where: {
                                email: {
                                    $eq: username
                                },
                                password: {
                                    $eq: crypto.createHash('md5').update(password).digest('hex')
                                }
                            }
                        });

                    case 2:
                        checkPassword = _context.sent;

                        if (!(checkPassword != null)) {
                            _context.next = 7;
                            break;
                        }

                        return _context.abrupt('return', done(null, checkPassword.get()));

                    case 7:
                        return _context.abrupt('return', done(null, null, { message: 'Invalid username or password.' }));

                    case 8:
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
    done(null, user.parent_id);
});
_passport2.default.deserializeUser(function (id, done) {
    _connector.Parent.find({
        attributes: ['parent_id', 'gender', 'parent_name', 'phone_m', 'email'],
        where: {
            parent_id: {
                $eq: id
            }
        }
    }).then(function (parent, err) {
        return done(err, parent.get());
    });
});
//# sourceMappingURL=auth.js.map