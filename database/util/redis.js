// const redis = require('redis');


// module.exports.redisClient = () => {
//   try {
//       console.log(process.env.MONGO_DB_URL, "##############");
//       console.log(process.env.REDIS_HOSTNAME, "##############");
//       console.log(process.env.REDIS_PORT, "##############");
//       console.log(process.env.REDIS_PASSWORD, "##############");

  
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

// const redis = require('redis');
// const client = redis.createClient({
//     host: `${process.env.REDIS_HOSTNAME}`,
//     port: `${process.env.REDIS_PORT}`,
//     password:`${process.env.REDIS_PASSWORD}`
// });

// client.on('connect', err => {
//   console.log('Connected to Redis Instance');
// });

// client.on('error', err => {
//     console.log('Error ' + err);
// });

// module.exports.redisClient = client;
