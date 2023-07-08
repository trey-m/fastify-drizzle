const { drizzle } = require('drizzle-orm/node-postgres');
const { Client, Pool } = require('pg');
const { connectorInitializationErrorMessage } = require('../utils/connector');

module.exports = async (opts) => {
  try {
    let handler;
    const connectionString = opts.connectionString;
    if (opts.isPool) {
      handler = drizzle(new Pool({ connectionString }));
    } else {
      const client = new Client({ connectionString });
      await client.connect();
      handler = drizzle(client);
    }
    return handler;
  } catch (err) {
    throw new Error(connectorInitializationErrorMessage(opts.connector));
  }
};
