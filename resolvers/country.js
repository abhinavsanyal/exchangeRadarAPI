const axios = require("axios");
const { combineResolvers } = require("graphql-resolvers");
const { isValidObjectId } = require('../database/util');

const Country = require("../database/models/country");
const User = require("../database/models/user");
const Currency = require("../database/models/currency");
const { isAuthenticated, isCountryOwner } = require("./middleware");
const { stringToBase64, base64ToString } = require("../helper");

module.exports = {
  Query: {
    getAddedCountries: combineResolvers(
      isAuthenticated,
      async (_, { cursor, limit = 10 }, { loggedInUserId }) => {
        try {
          const query = { user: loggedInUserId };
          if (cursor) {
            query['_id'] = {
              '$lt': base64ToString(cursor)
            }
          };
          let countries = await Country.find(query).sort({ _id: -1 }).limit(limit + 1);
          const hasNextPage = countries.length > limit;
          countries = hasNextPage ? countries.slice(0, -1) : countries;
          return {
            countryFeed: countries,
            pageInfo: {
              nextPageCursor: hasNextPage ? stringToBase64(countries[countries.length - 1].id) : null,
              hasNextPage,
            },
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
    getCountriesByName: combineResolvers(isAuthenticated, async (_, { name }) => {
      try {
        const countries = await axios
          .get(`https://restcountries.eu/rest/v2/name/${name}`)
          .then(({ data }) => data);
        return countries;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
  },
  Mutation: {
    addCountry: combineResolvers(
      isAuthenticated,
      async (_, { input }, { email }) => {
        try {
          // Find the loggedIn User
          const user = await User.findOne({ email });

          // Get the currency of the new Country from input payload
          const currency = input.currencies[0];

          // Get exchange rate from fixer API 
          const code = currency.code;
          const latestConversionRateResponse = await axios
            .get(
              `${process.env.FIXER_ENDPOINT}${process.env.FIXER_ACCESS_KEY}&base=EUR&symbols=${code}`
            )
            .then(({ data }) => data);
          const exhangeRate = latestConversionRateResponse.rates[`${code}`];

          // Create new country document to save ( without currencies )
          const newCountryData = { name: input.name , population: input.population, exchangeRateToSEK: exhangeRate, flag: input.flag  };
          const country = new Country({ ...newCountryData, user: user.id });

          // Push the currency id to  
          const currencyId = await Currency.findOne({code});
          if(!currencyId){
            const newCurrency =  new Currency({...currency});
            const currencySaved = await newCurrency.save();
            country.currencies.push(currencySaved.id);
          } else {
            country.currencies.push(currencyId._id);
          }    
          const result = await country.save();
          user.countries.push(result.id);
          await user.save();
          return country;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
    deleteCountry: combineResolvers(
      isAuthenticated,
      isCountryOwner,
      async (_, { id }, { loggedInUserId }) => {
        try {
          const country = await Country.findByIdAndDelete(id);
          await User.updateOne({ _id: loggedInUserId }, { $pull: { countries: country.id } });
          return country;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
  },
  Country: {
    user: async (parent, _, { loaders }) => {
      try {
        const user = await loaders.user.load(parent.user.toString());
        return user;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    currencies:  async (parent, _, { loaders }) => {
      try {
        // If parent node has currencies => return currencies
        if(!isValidObjectId(parent.currencies[0])) return parent.currencies
        // Fetch currency by currency id from parent node
        const currency = await Currency.findById(parent.currencies[0]); 
        // const currency = await loaders.currency.load(parent.currencies[0]);
        let currencies = [];
        currencies.push(currency)
        return  currencies;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
