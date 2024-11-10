const { drizzle } = require('drizzle-orm/libsql');
const { createClient } = require('@libsql/client');

const { connectorInitializationErrorMessage } = require('../utils/connector');

module.exports = async (opts) => {
  try {
    const handler = drizzle(createClient({ url: opts.connectionString, authToken: opts.authToken }));
    return handler;
  } catch (err) {
    throw new Error(connectorInitializationErrorMessage(opts.connector));
  }
};
