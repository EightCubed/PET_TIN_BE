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
const REFRESH_TOKEN_EXPIRES = "1d";

const BEARER_TOKEN_EXPIRE_TIME = 10 * 1000;
const REFRESH_TOKEN_EXPIRE_TIME = 24 * 60 * 60 * 1000;

module.exports = {
  client,
  BEARER_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
  BEARER_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
};
