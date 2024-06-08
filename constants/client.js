const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const BEARER_TOKEN_EXPIRES = "10s";
const REFRESH_TOKEN_EXPIRES_SHORT = "1h";
const REFRESH_TOKEN_EXPIRES_LONG = "10s";

const BEARER_TOKEN_EXPIRE_TIME = 10 * 1000;
const REFRESH_TOKEN_EXPIRE_TIME_SHORT = 10 * 1000;
const REFRESH_TOKEN_EXPIRE_TIME_LONG = 24 * 60 * 60 * 1000;

module.exports = {
  client,
  BEARER_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES_SHORT,
  REFRESH_TOKEN_EXPIRES_LONG,
  BEARER_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME_SHORT,
  REFRESH_TOKEN_EXPIRE_TIME_LONG,
};
