import {
    makeExecutableSchema,
} from 'graphql-tools';

import resolvers from './resolvers';

const typeDefs = `

scalar Date

type Query {
  parents: [Parent]
  parent(email: String!): Parent
  parentPassenger(parent_id: Int!): [Passenger]
  passengerRouteToday(passenger_id: Int!) : [PassengerRoute]
  passengerByQuote(quote_id: Int!): [RouteByQuote]
  watchTracking(j_id: Int!): CurrentTracking
  companyContact: Company
  parentGlobalSelect(email: String!): ParentGlobal
}

type Mutation {
  parentVerifyTokenUpdate(input: UpdateVerifyTokenInput): UpdateVerifyTokenPayload
  parentPasswordUpdate(input: UpdatePasswordInput!) : UpdatePasswordPayload
  parentPushTokenCreate(input: CreateParentPushTokenInput!) : CreateParentPushTokenPayload
}

input CreateParentPushTokenInput {
  email: String!
  push_token: String!
}

type CreateParentPushTokenPayload {
  msg: String!
  status: Boolean!
}

input UpdatePasswordInput {
  email: String!
  password: String!
}

type UpdatePasswordPayload {
  msg: String!
  status: Boolean!
}

input UpdateVerifyTokenInput {
  verifyCode: Int!
}

type UpdateVerifyTokenPayload {
  msg: String!
  status: Boolean!
}

type ParentGlobal {
  email: String
  phone: String
  database_school: String
}


type Parent {
  parent_id: Int!
  gender: String
  parent_name: String
  phone_m: String
  email: String 
}

type ParentPassenger {
  parent_id: Int!
  passenger_id: Int!
}

type Passenger {
  uniqueID: String!
  passenger_id: Int!
  first_name: String!
  surname: String!
  date_of_birth: String!
  gender: String!
  address: String!
  phone_m: String!
  email: String!
  account: Int!
  RFID: String!
}

type PassengerRoute {
  j_id: Int!
  collection_address: PickUpRoute!
  destination_address: DropOffRoute!
  peroid: String!
  date_today: String!
  extra_address: [ExtraRoute]
  tracking: CurrentTracking
}

type PickUpRoute {
  time_start: String!
  address: String!
  progress: Int! 
  latlng: String!
  passenger_log: [PassengerLog]!
}

type DropOffRoute {
  time_end: String!
  address: String!
  progress: Int!
  latlng: String!
  passenger_log: [PassengerLog]
}

type PassengerLog {
  log_type_code: Int!
  log_type_name: String!
  log_note: String!
  date_time_scan: Date!
  route_type: Int!
  address: MovementAddress
  movement_order: Int!
}

type ExtraRoute {
  movement_order: Int!
  latlng: String!
}

type MovementAddress {
  collection: String
  destination: String
}

type PassengerInRoute {
  passenger_id: Int!
  pickup: Int!
  passenger: Passenger
}

type RouteByQuote {
  movement_id: Int!
  collection: String!
  destination: String!
  pickup: [PassengerInRoute]!
  dropoff: [PassengerInRoute]!
}

type CurrentTracking {
  lat: String!
  lng: String!
  timestamp: Date!
  j_id: Int!
}

type Company {
  company_name: String!
  address: String!
  tel: String!
  operation_email: String!
}


schema {
  query: Query
  mutation: Mutation
}
`;


const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;