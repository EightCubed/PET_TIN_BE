const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const BEARER_TOKEN_EXPIRES = "1h";
const REFRESH_TOKEN_EXPIRES_SHORT = "1h";
const REFRESH_TOKEN_EXPIRES_LONG = "1h";

const SECONDS = 1000;

const BEARER_TOKEN_EXPIRE_TIME = 60 * 60 * SECONDS;
const REFRESH_TOKEN_EXPIRE_TIME_SHORT = 60 * 60 * SECONDS;
const REFRESH_TOKEN_EXPIRE_TIME_LONG = 1 * 60 * 60 * SECONDS;

module.exports = {
  client,
  BEARER_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES_SHORT,
  REFRESH_TOKEN_EXPIRES_LONG,
  BEARER_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME_SHORT,
  REFRESH_TOKEN_EXPIRE_TIME_LONG,
};
