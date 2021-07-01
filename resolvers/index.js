const { GraphQLDateTime } = require('graphql-iso-date');

const userResolver = require('./user');
const countryResolver = require('./country');

const customDateScalarResolver = {
  Date: GraphQLDateTime
}

module.exports = [
  userResolver,
  countryResolver,
  customDateScalarResolver
];