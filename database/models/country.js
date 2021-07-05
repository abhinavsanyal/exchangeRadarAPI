const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    flag: {
      type: String,
    },
    population: {
      type: Number,
      required: true,
    },
    exchangeRateToSEK: {
      type: Number,
    },
    currencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Currency",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Country", countrySchema);
