const { skip } = require('graphql-resolvers');
const Country = require('../../database/models/country');
const { isValidObjectId } = require('../../database/util');
const limit = 5;
const interval = 30;

// module.exports.rateLimit = async (_, args, { email , redis}) => {
  
//   const key = `rate-limit-${email}`;
//   // const client = await redis;
//   const current = await redis.incr(key, (resp)=>{
//     console.log("Did i get a response ?", resp)
//   });
//   console.log("current value", current)
//   if (current > limit) {
//     throw new Error('Hold your horses for a minute please!');
//   } else if(current === 1) {
//     await redis.expire(key,interval)
//   }
//   return skip;
// }

module.exports.isAuthenticated = (_, __, { email }) => {
  if (!email) {
    throw new Error('Access Denied! Please login to continue');
  }
  return skip;
}

module.exports.isCountryOwner = async (_, { id }, { loggedInUserId }) => {
  try {
    if (!isValidObjectId(id)) {
      throw new Error('Invalid Country id');
    }
    const country = await Country.findById(id);
    if (!country) {
      throw new Error('Country not found');
    } else if (country.user.toString() !== loggedInUserId) {
      throw new Error('Not authorized as country owner');
    }
    return skip;
  } catch (error) {
    console.log(error);
    throw error;
  }
}