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
  type Mutation {
    addUser(name: String!, email: String!): User!
    updateUser(_id: ID!, email: String!): User!
  }

  type Query {
    getUser(_id: ID!): User,
    getUsers: [User],
    getAddresses: [Address],
    hello: String,
    hey: String,
    randomPerson: Person
  }

  type User {
    _id: String!,
    name: String!,
    email: String!,
    address: Address
  },

  type Address {
    _id: String!,
    city: String!,
    country: String!,
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
        async getUser(parent, args, context, info) {
            return await User.findOne({ _id: args._id }).populate("address");
        },
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

    Mutation: {
        async addUser(parent, args, context, info) {
            const user = new User({
                name: args.name,
                email: args.email
            })
            await user.save()
            return user
        },

        async updateUser(parent, args) {
            return User.findOneAndUpdate({ _id: args._id }, { email: args.email }, { new: true })
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);