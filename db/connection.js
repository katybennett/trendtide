const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || 'development'

require('dotenv').config({path: `${__dirname}/../.env.${ENV}`})

const db = new Pool();

if (ENV === 'development' && !process.env.PGDATABASE) {
  throw new Error("PGDATABASE not set")
} else if (ENV === 'production' && !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set")
} else { 
    console.log(`Connected to ${process.env.PGDATABASE || process.env.DATABASE_URL}`)
}

const config = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

module.exports = new Pool(config);

