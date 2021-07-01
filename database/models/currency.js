const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    code: {
      type: String,
    },
    symbol: {
      type: String,
    }
  }
);

module.exports = mongoose.model("Currency", currencySchema);
