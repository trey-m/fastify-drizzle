const { drizzle } = require('drizzle-orm/node-postgres');
const { Client, Pool } = require('pg');

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
    console.log(err);
    throw new Error(`An error occured initializing ${opts.connector}`);
  }
};
