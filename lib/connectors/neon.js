const { drizzle } = require('drizzle-orm/node-postgres');
const { neon, neonConfig } = require('@neondatabase/serverless');
const { connectorInitializationErrorMessage } = require('../utils/connector');

neonConfig.fetchConnectionCache = true;

module.exports = async (opts) => {
  try {
    let handler;
    const connectionString = opts.connectionString;
    const client = neon(connectionString);
    handler = drizzle(client);
    return handler;
  } catch (err) {
    throw new Error(connectorInitializationErrorMessage(opts.connector));
  }
};
