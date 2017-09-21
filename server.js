import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import schema from './data/schema';
import cors from 'cors';
// import resolvers from './data/resolvers';


const GRAPHQL_PORT = 3000;

const graphQLServer = express();

const whitelist = [
    // Allow domains here
    'http://localhost:8100',
    'http://localhost:8101',
    'http://192.168.1.21:8100',
    'http://192.168.1.21:8101'
];
const corsOptions = {
    origin(origin, callback) {
        const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
graphQLServer.use(cors(corsOptions));

graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
));