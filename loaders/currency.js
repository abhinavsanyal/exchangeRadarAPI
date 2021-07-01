const { currency } = require(".");
const Currency = require("../database/models/currency");

module.exports.batchCurrencies = async (currencyIds) => {
  const currencies = await Currency.find({ _id: { $in: currencyIds } });
  return currencyIds.map((currencyId) =>
    currencies.find((currency) => currency.id === currencyId)
  );
};
