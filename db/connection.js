const { Pool } = require('pg');
const ENV = process.env.NODE_ENV == 'development';

require('dotenv').config({
  path: ENV ? `${__dirname}/../.env.${ENV}`: `${__dirname}/../.env.test`,
});

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

module.exports = new Pool();
