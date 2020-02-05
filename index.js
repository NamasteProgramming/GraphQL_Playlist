const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose')
const { User, Address } = require('./schema')
const faker = require('faker')

// mongoose.set('debug', true);
mongoose.connect('mongodb://localhost:27017/graphql', {
    useNewUrlParser: true,
});

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    getUsers: [User],
    getAddresses: [Address],
    hello: String,
    hey: String,
    randomPerson: Person
  }

  type User {
    _id: String,
    name: String,
    email: String,
    address: Address
  },

  type Address {
    _id: String,
    city: String,
    country: String,
    user: User
  }

  type Person {
      name: String,
      email: String,
      lat: Float,
      lng: Float,
      street: String
  }
`;

// resolvers are used to retreive data
const resolvers = {
    Query: {
        async getUsers() {
            return await User.find({}).populate("address")
        },
        async getAddresses() {
            return await Address.find({}).populate('user')
        },
        hello() {
            return 'Hi World'
        },
        hey() {
            return "GraphQL is fun"
        },
        randomPerson() {
            return {
                name: faker.name.firstName(),
                email: faker.internet.email(),
                lat: faker.address.latitude(),
                lng: faker.address.longitude(),
                street: faker.address.streetAddress
            }
        }
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);