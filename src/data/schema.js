import {
    makeExecutableSchema,
} from 'graphql-tools';

import resolvers from './resolvers';

const typeDefs = `

    scalar Date

    type Query {
        parentGlobalSelect(email: String!): ParentGlobal
        parent(email: String!): [ParentBySchool]
        parentPassengers(email: String!): [PassengersBySchool]
        schoolContact: [SchoolContact]
        parentContactOptions: ParentContactOptions
    }

    type Mutation {
        parentPasswordUpdate(input: UpdatePasswordInput!) : UpdatePasswordPayload
        parentPushTokenCreate(input: CreateParentPushTokenInput!) : CreateParentPushTokenPayload
        parentPushTokenDelete(input: DeleteParentPushTokenInput!) : DeleteParentPushTokenPayload
        parentUpdateContactOption(input: UpdateParentContactOptionInput!) : UpdateParentContactOptionPayload
    }

    input CreateParentPushTokenInput {
        push_token: String!
    }
    
    type CreateParentPushTokenPayload {
        msg: String!
        status: Boolean!
    }

    input DeleteParentPushTokenInput {
        push_token: String!
    }

    type DeleteParentPushTokenPayload {
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

    input UpdateParentContactOptionInput {
        key: String!
        value: Int!
    }

    type UpdateParentContactOptionPayload {
        msg: String!
        status: Boolean!
    }

    type ParentContactOptions {
        accept_email: Int!
        accept_notification: Int!
    }

    type ParentGlobal {
        email: String
        phone: String
    }

    type ParentBySchool {
        school_name: String!
        parent: Parent!
    }
    

    type Parent {
        parent_id: Int!
        gender: String
        parent_name: String
        phone_m: String
        email: String 
    }

    type PassengersBySchool {
        school_name: String!
        passengers: [Passenger]
    }

    type Passenger {
        uniqueID: String
        passenger_id: Int!
        first_name: String!
        surname: String
        date_of_birth: String
        gender: String
        address: String
        phone_m: String!
        email: String!
        account: Int!
        RFID: String!
        routeToday: [PassengerRoute]
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

    type SchoolContact {
        name: String!
        address: String!
        tracking_phone: String!
        tracking_email: String!
    }

    schema {
        query: Query
        mutation: Mutation
    }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;