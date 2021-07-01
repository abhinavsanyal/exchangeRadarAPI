const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    getCountriesByName(name: String!): [Country!]
    getAddedCountries(cursor: String, limit: Int): CountryFeed!
  }

  type CountryFeed {
    countryFeed: [Country!]
    pageInfo: PageInfo!
  }

  type PageInfo {
    nextPageCursor: String
    hasNextPage: Boolean
  }

  input createCountryInput {
    name: String!
    population: Int!
    flag: String
    currencies: [currencyInput!]
  }

  input currencyInput {
    name: String
    code: String
    symbol: String
  }

  extend type Mutation {
    addCountry(input: createCountryInput!): Country
    deleteCountry(id: ID!): Country
  }

  type Country {
    id: ID!
    name: String!
    flag:String
    population: Int!
    currencies: [Currency!]
    exchangeRateToSEK: String
    user: User
    createdAt: Date
    updatedAt: Date
  }

  type Currency {
    code: String
    name: String
    symbol: String
  }
`;
