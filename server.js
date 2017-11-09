const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const dynamoConnection = require('./src/database/pallet_op.js')
const s = require('./src/graphql/schema/schema.js')
const resolvers = require('./src/graphql/resolvers.js').getResolver()

var typeDefs = s.typeDefs();
var palletSchema = s.palletSchema();
var schema = makeExecutableSchema({ typeDefs, resolvers });
var app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
console.log('waiting for dynamodb response.....')
app.listen(4000, () => console.log('Now browse to localhost:4000/graphiql'));
