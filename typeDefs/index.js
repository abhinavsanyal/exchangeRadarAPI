const { gql } = require('apollo-server-express');

const userTypeDefs = require('./user');
const countryTypeDefs = require('./country');
const {
  createRateLimitDirective,
  createRateLimitTypeDef,
} = require('graphql-rate-limit-directive');
const typeDefs = gql`

  scalar Date
  
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
  type Subscription {
    _: String
  }
`;

module.exports = [
  typeDefs,
  userTypeDefs,
  countryTypeDefs
]

