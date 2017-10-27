'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _graphqlTools = require('graphql-tools');

var _resolvers = require('./resolvers');

var _resolvers2 = _interopRequireDefault(_resolvers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeDefs = '\n\n    scalar Date\n\n    type Query {\n        parentGlobalSelect(email: String!): ParentGlobal\n        parent(email: String!): [ParentBySchool]\n        parentPassengers(email: String!): [PassengersBySchool]\n        schoolContact: [SchoolContact]\n    }\n\n    type Mutation {\n        parentPasswordUpdate(input: UpdatePasswordInput!) : UpdatePasswordPayload\n        parentPushTokenCreate(input: CreateParentPushTokenInput!) : CreateParentPushTokenPayload\n    }\n\n    input CreateParentPushTokenInput {\n        push_token: String!\n    }\n    \n    type CreateParentPushTokenPayload {\n        msg: String!\n        status: Boolean!\n    }\n    \n    input UpdatePasswordInput {\n        email: String!\n        password: String!\n    }\n    \n    type UpdatePasswordPayload {\n        msg: String!\n        status: Boolean!\n    }\n\n    type ParentGlobal {\n        email: String\n        phone: String\n    }\n\n    type ParentBySchool {\n        school_name: String!\n        parent: Parent!\n    }\n    \n\n    type Parent {\n        parent_id: Int!\n        gender: String\n        parent_name: String\n        phone_m: String\n        email: String \n    }\n\n    type PassengersBySchool {\n        school_name: String!\n        passengers: [Passenger]\n    }\n\n    type Passenger {\n        uniqueID: String\n        passenger_id: Int!\n        first_name: String!\n        surname: String\n        date_of_birth: String\n        gender: String\n        address: String\n        phone_m: String!\n        email: String!\n        account: Int!\n        RFID: String!\n        routeToday: [PassengerRoute]\n    }\n\n    type PassengerRoute {\n        j_id: Int!\n        collection_address: PickUpRoute!\n        destination_address: DropOffRoute!\n        peroid: String!\n        date_today: String!\n        extra_address: [ExtraRoute]\n        tracking: CurrentTracking\n    }\n    \n    type PickUpRoute {\n        time_start: String!\n        address: String!\n        progress: Int! \n        latlng: String!\n        passenger_log: [PassengerLog]!\n    }\n\n    type DropOffRoute {\n        time_end: String!\n        address: String!\n        progress: Int!\n        latlng: String!\n        passenger_log: [PassengerLog]\n    }\n\n    type PassengerLog {\n        log_type_code: Int!\n        log_type_name: String!\n        log_note: String!\n        date_time_scan: Date!\n        route_type: Int!\n        address: MovementAddress\n        movement_order: Int!\n    }\n\n    type ExtraRoute {\n        movement_order: Int!\n        latlng: String!\n    }\n\n    type MovementAddress {\n        collection: String\n        destination: String\n    }\n\n    type PassengerInRoute {\n        passenger_id: Int!\n        pickup: Int!\n        passenger: Passenger\n    }\n\n    type RouteByQuote {\n        movement_id: Int!\n        collection: String!\n        destination: String!\n        pickup: [PassengerInRoute]!\n        dropoff: [PassengerInRoute]!\n    }\n\n    type CurrentTracking {\n        lat: String!\n        lng: String!\n        timestamp: Date!\n        j_id: Int!\n    }\n\n    type SchoolContact {\n        name: String!\n        address: String!\n        phone: String!\n        email: String!\n    }\n\n    schema {\n        query: Query\n        mutation: Mutation\n    }\n';

var schema = (0, _graphqlTools.makeExecutableSchema)({ typeDefs: typeDefs, resolvers: _resolvers2.default });

exports.default = schema;
//# sourceMappingURL=schema.js.map