const mongoose = require("mongoose");
// const redis = require("redis");

// module.exports.redisClient = () => {
//   try {
//     const client = redis.createClient({
//       host: `${process.env.REDIS_HOSTNAME}`,
//       port: `${process.env.REDIS_PORT}`,
//       password: `${process.env.REDIS_PASSWORD}`,
//     });

//     client.on("connect", () => {
//       console.log("Connected to redis instance!");
//     });

//     return client;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

module.exports.connection = async () => {
  try {
    mongoose.set("debug", true);
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
