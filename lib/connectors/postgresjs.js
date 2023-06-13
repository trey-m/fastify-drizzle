const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

module.exports = async (opts) => {
  try {
    const client = postgres(opts.connectionString);
    const handler = drizzle(client);
    return handler;
  } catch (err) {
    console.log(err);
    throw new Error(`An error occured initializing ${opts.connector}`);
  }
};
