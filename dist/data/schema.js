'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlTools = require('graphql-tools');

var _resolvers = require('./resolvers');

var _resolvers2 = _interopRequireDefault(_resolvers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeDefs = '\n\nscalar Date\n\ntype Query {\n  parents: [Parent]\n  parent(email: String!): Parent\n  parentPassenger(parent_id: Int!): [Passenger]\n  passengerRouteToday(passenger_id: Int!) : [PassengerRoute]\n  passengerByQuote(quote_id: Int!): [RouteByQuote]\n  watchTracking(j_id: Int!): CurrentTracking\n  companyContact: Company\n}\n\ntype Mutation {\n  parentVerifyTokenUpdate(input: UpdateVerifyTokenInput): UpdateVerifyTokenPayload\n  parentPasswordUpdate(input: UpdatePasswordInput!) : UpdatePasswordPayload\n  parentPushTokenCreate(input: CreateParentPushTokenInput!) : CreateParentPushTokenPayload\n}\n\ninput CreateParentPushTokenInput {\n  email: String!\n  push_token: String!\n}\n\ntype CreateParentPushTokenPayload {\n  msg: String!\n  status: Boolean!\n}\n\ninput UpdatePasswordInput {\n  email: String!\n  password: String!\n}\n\ntype UpdatePasswordPayload {\n  msg: String!\n  status: Boolean!\n}\n\ninput UpdateVerifyTokenInput {\n  verifyCode: Int!\n}\n\ntype UpdateVerifyTokenPayload {\n  msg: String!\n  status: Boolean!\n}\n\n\ntype Parent {\n  parent_id: Int!\n  gender: String\n  parent_name: String\n  phone_m: String\n  email: String \n}\n\ntype ParentPassenger {\n  parent_id: Int!\n  passenger_id: Int!\n}\n\ntype Passenger {\n  uniqueID: String!\n  passenger_id: Int!\n  first_name: String!\n  surname: String!\n  date_of_birth: String!\n  gender: String!\n  address: String!\n  phone_m: String!\n  email: String!\n  account: Int!\n  RFID: String!\n}\n\ntype PassengerRoute {\n  j_id: Int!\n  collection_address: PickUpRoute!\n  destination_address: DropOffRoute!\n  peroid: String!\n  date_today: String!\n  extra_address: [ExtraRoute]\n  tracking: CurrentTracking\n}\n\ntype PickUpRoute {\n  time_start: String!\n  address: String!\n  progress: Int! \n  latlng: String!\n  passenger_log: [PassengerLog]!\n}\n\ntype DropOffRoute {\n  time_end: String!\n  address: String!\n  progress: Int!\n  latlng: String!\n  passenger_log: [PassengerLog]\n}\n\ntype PassengerLog {\n  log_type_code: Int!\n  log_type_name: String!\n  log_note: String!\n  date_time_scan: Date!\n  route_type: Int!\n  address: MovementAddress\n  movement_order: Int!\n}\n\ntype ExtraRoute {\n  movement_order: Int!\n  latlng: String!\n}\n\ntype MovementAddress {\n  collection: String\n  destination: String\n}\n\ntype PassengerInRoute {\n  passenger_id: Int!\n  pickup: Int!\n  passenger: Passenger\n}\n\ntype RouteByQuote {\n  movement_id: Int!\n  collection: String!\n  destination: String!\n  pickup: [PassengerInRoute]!\n  dropoff: [PassengerInRoute]!\n}\n\ntype CurrentTracking {\n  lat: String!\n  lng: String!\n  timestamp: Date!\n  j_id: Int!\n}\n\ntype Company {\n  company_name: String!\n  address: String!\n  tel: String!\n  operation_email: String!\n}\n\n\nschema {\n  query: Query\n  mutation: Mutation\n}\n';

var schema = (0, _graphqlTools.makeExecutableSchema)({ typeDefs: typeDefs, resolvers: _resolvers2.default });

exports.default = schema;
//# sourceMappingURL=schema.js.map