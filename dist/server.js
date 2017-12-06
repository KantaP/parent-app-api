'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _schema = require('./data/schema');

var _schema2 = _interopRequireDefault(_schema);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _connector = require('./data/connector');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graphqlHTTP = require('express-graphql');

var _require = require('graphql-errors'),
    maskErrors = _require.maskErrors;

var jwt = require('jsonwebtoken');
var session = require('express-session');
var flash = require('connect-flash');
var crypto = require('crypto');
var axios = require('axios');
var querystring = require('querystring');
// const privateJWT = crypto.createHash('md5').update(config.PARENT_APP_TOKEN).digest('hex')
require('./auth.js');

var admin = require("firebase-admin");
var serviceAccount = require("./driverapp-1470129684507-firebase-adminsdk-qd3ut-0b2e7204c7.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var BearerStrategy = require('passport-http-bearer').Strategy;
_passport2.default.use(new BearerStrategy(function (token, cb) {
    try {
        if (token == null) {
            return cb(null, null);
        }
        console.log(token);
        var user = jwt.verify(token, _config2.default.PARENT_APP_TOKEN);
        console.log(user);
        if (user && user != null) {
            return cb(null, user);
        } else {
            return cb(null, null);
        }
    } catch (err) {
        return cb(err.message);
    }
}));
var GRAPHQL_PORT = 3000;

var graphQLServer = (0, _express2.default)();
graphQLServer.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
graphQLServer.use(flash());
graphQLServer.use(_passport2.default.initialize());
graphQLServer.use(_passport2.default.session());

var corsOptions = {
    origin: function origin(_origin, callback) {
        callback(null, true);
    },

    credentials: true
};
graphQLServer.use((0, _cors2.default)(corsOptions));
var allowCrossDomain = function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};
graphQLServer.use(allowCrossDomain);

// maskErrors(schema);
graphQLServer.use('/graphql', _passport2.default.authenticate('bearer', { session: false }), graphqlHTTP(function (request) {
    var startTime = Date.now();
    var user = request.user;

    return {
        schema: _schema2.default,
        graphiql: true,
        context: { user: user },
        extensions: function extensions(_ref) {
            var document = _ref.document,
                variables = _ref.variables,
                operationName = _ref.operationName,
                result = _ref.result;

            return { runTime: Date.now() - startTime };
        }
    };
}));

graphQLServer.use(_bodyParser2.default.json()); // support json encoded bodies
graphQLServer.use(_bodyParser2.default.urlencoded({ extended: true }));

graphQLServer.post('/sendSMS', _passport2.default.authenticate('bearer', { session: false }), function (req, res) {
    if (req.user == null) {
        res.status(401).send({ message: 'Unauthorize' });
    } else {
        var body = {
            to: req.body.to.split(','),
            text: req.body.text
        };
        var options = {
            url: 'https://api.clickatell.com/rest/message',
            headers: {
                'Authorization': "bearer 0WfPOyBctycsSud4NFQzSlq1hpEYfrLJb0pyqG.UrQyW24RJUchUx.J_n08vjw1U",
                'X-Version': '1',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: body,
            json: true
        };
        _request2.default.post(options, function (error, response, body) {
            if (!error && response.statusCode == 202) {
                res.send(body.data);
            } else {
                res.send(error);
            }
        });
    }
});

graphQLServer.post('/login', _passport2.default.authenticate('local', { session: false, failureFlash: true }), function (req, res) {
    var token = jwt.sign({
        id: req.user.id,
        auth: true,
        mutate: ['ALL'],
        query: ['ALL'],
        databases: req.user.databases,
        email: req.user.email
    }, _config2.default.PARENT_APP_TOKEN, { expiresIn: "1d" });
    var _req$user = req.user,
        id = _req$user.id,
        email = _req$user.email,
        phone = _req$user.phone,
        companiesLogo = _req$user.companiesLogo;

    res.send({
        token: token,
        user: { id: id, email: email, phone: phone, companiesLogo: companiesLogo }
    });
});

graphQLServer.post('/prepareEmailVerify', function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res) {
        var shareDB, parent, token;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        shareDB = (0, _connector.sequelizeInitial)('ecm_share');
                        _context.next = 3;
                        return shareDB.ParentGlobal.find({
                            where: {
                                email: req.body.email
                            }
                        });

                    case 3:
                        parent = _context.sent;

                        if (parent != null) {
                            token = jwt.sign({ id: parent.get().id, auth: false, mutate: ['UPDATE_PASSWORD'], query: ['SELECT_PARENT_GLOBAL'] }, _config2.default.PARENT_APP_TOKEN, { expiresIn: 3600 });

                            res.send({
                                token: token
                            });
                        } else {
                            res.send({
                                token: ""
                            });
                        }

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref2.apply(this, arguments);
    };
}());

graphQLServer.get('/testPush/:token', function (req, res) {

    // var registrationToken = "f0flvIMd2mc:APA91bEjaAmX-GRxu3W1WSyLrjkwLYoD34OD4Pzt4LnWWBCnh1ODvMEdc1fHcxiBKrO5cW-SnIs9vBnrAyUrg0ToMskUs4RrMb7T4Vu9DYVFL5MUmeOWQvu4X7YhSfM6WJPq_VxeQ1nz"
    var registrationToken = req.params.token;
    var payload = {
        data: {
            title: "AUX Scrum",
            message: "Scrum: Daily touchbase @ 10am Please be on time so we can cover everything on the agenda.",
            actions: JSON.stringify([{ icon: "emailGuests", title: "EMAIL GUESTS", callback: "emailGuests", foreground: false, inline: true, replyLabel: "Enter your reply here" }, { icon: "snooze", title: "SNOOZE", callback: "snooze", foreground: false }])
        }
    };
    admin.messaging().sendToDevice(registrationToken, payload, {
        contentAvailable: true,
        priority: "normal",
        restrictedPackageName: "com.ecoachmanager.parentapp"
    }).then(function (response) {
        // See the MessagingDevicesResponse reference documentation for
        // the contents of response.
        console.log("Successfully sent message:", response);
        res.send(response);
    }).catch(function (error) {
        console.log("Error sending message:", error);
        res.send(error);
    });
});

graphQLServer.get('/companycode/:app_code', function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, res) {
        var api_url, query_string, companyCode, companyData;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        api_url = "http://journeybug.local.ppcnseo.com/";
                        query_string = "lib/api/?company=1";
                        companyCode = req.params.app_code;
                        _context2.next = 5;
                        return axios.post(api_url + query_string, querystring.stringify({ code: companyCode }));

                    case 5:
                        companyData = _context2.sent;

                        console.log(companyData);

                    case 7:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
        return _ref3.apply(this, arguments);
    };
}());

graphQLServer.post('/passOnDevices', function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(req, res) {
        var shareDB, parent, tokens, payload;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        shareDB = (0, _connector.sequelizeInitial)('ecm_share');
                        _context3.next = 3;
                        return shareDB.ParentGlobal.find({
                            include: [{
                                model: shareDB.ParentToken,
                                attributes: ['push_token'],
                                required: true
                            }],
                            where: {
                                email: req.body.email
                            }
                        });

                    case 3:
                        parent = _context3.sent;

                        if (parent != null) {
                            tokens = parent.get().tb_parent_tokens.map(function (item) {
                                return item.push_token;
                            });
                            payload = {
                                data: Object.assign({}, req.body.data)
                            };

                            console.log(tokens);
                            console.log(payload);
                            admin.messaging().sendToDevice(tokens, payload, {
                                contentAvailable: true,
                                priority: "normal"
                            }).then(function (response) {
                                // See the MessagingDevicesResponse reference documentation for
                                // the contents of response.
                                console.log("Successfully sent message:", response);
                                res.send(response);
                            }).catch(function (error) {
                                console.log("Error sending message:", error);
                                res.send(error);
                            });
                        } else {
                            res.send({ email: req.body.email, status: false, msg: 'Not found token for this parent' });
                        }

                    case 5:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x5, _x6) {
        return _ref4.apply(this, arguments);
    };
}());

// graphQLServer.get('/refreshJWT', passport.authenticate('bearer', { session: false }), (req, res) => {
//     Parent.find({
//             attributes: ['token', 'parent_id'],
//             where: {
//                 token: {
//                     $eq: req.user
//                 }
//             }
//         })
//         .then((parent) => {
//             if (parent != null) {
//                 var token = jwt.sign({ id: parent.parent_id, }, config.JWT_SECRET, { expiresIn: 3600 })
//                 Parent.update({ token: token }, { where: { parent_id: parent.parent_id } })
//                     .then(() => {
//                         res.send({
//                             token: token
//                         })
//                     })
//             } else {
//                 res.send({ message: 'Not found this token in system' })
//             }
//         })
// })

graphQLServer.listen(GRAPHQL_PORT, function () {
    return console.log('GraphiQL is now running on http://localhost:' + GRAPHQL_PORT + '/graphiql');
});
//# sourceMappingURL=server.js.map