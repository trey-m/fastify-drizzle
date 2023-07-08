const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { connectorInitializationErrorMessage } = require('../utils/connector');

module.exports = async (opts) => {
  try {
    const client = postgres(opts.connectionString);
    const handler = drizzle(client);
    return handler;
  } catch (err) {
    throw new Error(connectorInitializationErrorMessage(opts.connector));
  }
};
