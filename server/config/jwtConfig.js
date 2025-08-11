// server/config/jwtConfig.js

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  // Use the secret key from your .env file
  secret: process.env.JWT_SECRET,

  // Set the token expiration time
  expiresIn: '1d' // This token will be valid for 1 day
};