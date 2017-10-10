import express from 'express';
const graphqlHTTP = require('express-graphql');
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import schema from './data/schema';
import cors from 'cors';
import request from 'request';
import passport from 'passport';
import config from './config';
import { sequelizeInitial } from './data/connector';
const { maskErrors } = require('graphql-errors');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const flash = require('connect-flash');
const crypto = require('crypto');

// const privateJWT = crypto.createHash('md5').update(config.PARENT_APP_TOKEN).digest('hex')
require('./auth.js');

const admin = require("firebase-admin");
const serviceAccount = require("./driverapp-1470129684507-firebase-adminsdk-qd3ut-0b2e7204c7.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


var BearerStrategy = require('passport-http-bearer').Strategy;
passport.use(new BearerStrategy(
    function(token, cb) {
        try {
            if (token == null) {
                return cb(null, null)
            }
            console.log(token)
            let user = jwt.verify(token, config.PARENT_APP_TOKEN);
            console.log(user)
            if (user && user != null) {
                return cb(null, user)
            } else {
                return cb(null, null)
            }
        } catch (err) {
            return cb(err.message)
        }
    }));
const GRAPHQL_PORT = 3000;

const graphQLServer = express();
graphQLServer.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))
graphQLServer.use(flash())
graphQLServer.use(passport.initialize());
graphQLServer.use(passport.session());


const corsOptions = {
    origin(origin, callback) {
        callback(null, true);
    },
    credentials: true
};
graphQLServer.use(cors(corsOptions));
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
graphQLServer.use(allowCrossDomain)

maskErrors(schema);
graphQLServer.use('/graphql', passport.authenticate('bearer', { session: false }), graphqlHTTP(request => {
    const startTime = Date.now();
    var { user } = request
    return {
        schema: schema,
        graphiql: true,
        context: { user },
        extensions({ document, variables, operationName, result }) {
            return { runTime: Date.now() - startTime };
        }
    };
}));

// graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

graphQLServer.use(bodyParser.json()); // support json encoded bodies
graphQLServer.use(bodyParser.urlencoded({ extended: false }));

graphQLServer.post('/sendSMS', passport.authenticate('bearer', { session: false }), (req, res) => {
    if (req.user == null) {
        res.status(400).send({ message: 'Unauthorize' })
    } else {
        var body = {
            to: req.body.to.split(','),
            text: req.body.text
        }
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
        request.post(options, (error, response, body) => {
            if (!error && response.statusCode == 202) {
                res.send(body.data)
            } else {
                res.send(error)
            }
        })
    }

})

graphQLServer.post('/login', passport.authenticate('local', { session: false, failureFlash: true }), (req, res) => {
    var token = jwt.sign({
        id: req.user.id,
        auth: true,
        mutate: ['ALL'],
        query: ['ALL'],
        databases: req.user.databases,
        email: req.user.email
    }, config.PARENT_APP_TOKEN, { expiresIn: 3600 })
    var { id, email, phone } = req.user
    res.send({
        token: token,
        user: { id, email, phone }
    })
});

graphQLServer.post('/prepareEmailVerify', async(req, res) => {
    var shareDB = sequelizeInitial('ecm_share')
    var parent = await shareDB.ParentGlobal.find({
        where: {
            email: req.body.email
        }
    })
    if (parent != null) {
        var token = jwt.sign({ id: parent.get().id, auth: false, mutate: ['UPDATE_PASSWORD'], query: ['SELECT_PARENT_GLOBAL'] }, config.PARENT_APP_TOKEN, { expiresIn: 3600 })
        res.send({
            token: token
        })
    } else {
        res.send({
            token: ""
        })
    }
})

graphQLServer.get('/testPush', () => {
    var registrationToken = "f0flvIMd2mc:APA91bEjaAmX-GRxu3W1WSyLrjkwLYoD34OD4Pzt4LnWWBCnh1ODvMEdc1fHcxiBKrO5cW-SnIs9vBnrAyUrg0ToMskUs4RrMb7T4Vu9DYVFL5MUmeOWQvu4X7YhSfM6WJPq_VxeQ1nz"
    var payload = {
        notification: {
            title: 'School Journey App',
            body: 'test api'
        },
        data: {
            score: "850",
            time: "2:45"
        }
    };
    admin.messaging().sendToDevice(registrationToken, payload)
        .then(function(response) {
            // See the MessagingDevicesResponse reference documentation for
            // the contents of response.
            console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
            console.log("Error sending message:", error);
        });
})


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

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
));