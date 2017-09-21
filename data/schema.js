import {
    makeExecutableSchema,
} from 'graphql-tools';

import resolvers from './resolvers';

const typeDefs = `

scalar Date

type Query {
  parents: [Parent]
  parent(email: String!): Parent
  parentWithPassword(email: String!, password: String!) : Parent
  parentPassenger(parent_id: Int!): [Passenger]
  passengers(passenger_id: [Int!]) : [Passenger]
  passengerRouteToday(passenger_id: Int!) : [PassengerRoute]
}

type Mutation {
  setPassword(email: String! , password: String!) : Parent
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
  passenger_id: Int!
  uniqueID: String!
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
  collection_address: PickUpRoute!
  destination_address: DropOffRoute!
  peroid: String!
  date_today: String!
  extra_address: [ExtraRoute]!
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
  passenger_log: [PassengerLog]!
}

type PassengerLog {
  log_type_code: Int!
  log_type_name: String!
  log_note: String!
  date_time_scan: Date!
  route_type: Int!
  address: String!
  movement_order: Int!
}

type ExtraRoute {
  movement_order: Int!
  latlng: String!
}



schema {
  query: Query
  mutation: Mutation
}
`;


const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;