const dotenv = require('dotenv');
const { logger } = require('./config.winston');

dotenv.config({ path: `.env.${process.env.ENVIROMENT || "development"}`}) ;

logger.info(`'MODE : ${process.env.ENVIROMENT}'`)


module.exports ={
  NODE:process.env.ENVIRONMENT,
  GITHUB_STRATEGY: process.env.GITHUB_STRATEGY,
  MONGO_URI: process.env.MONGO_URI,
  MONGODBURL: process.env.MONGODBURL,
  PRIVATE_KEY_JWT: process.env.PRIVATE_KEY_JWT,
  REGISTER_STRATEGY: process.env.REGISTER_STRATEGY,
  LOGIN_STRATEGY: process.env.LOGIN_STRATEGY,
  JWT_STRATEGY: process.env.JWT_STRATEGY,
  PORT : process.env.PORT,
  COOKIE_USER: process.env.COOKIE_USER,
  COOKIE_FORGOT: process.env.COOKIE_FORGOT,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET, 
  PERCIST:process.env.PERCIST,
  MEILING:{
    user:process.env.USERMAILING,
    password:process.env.PASSWORDMAILING
  }
}
