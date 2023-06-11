const fastify = require('fastify')({ logger: true });
const { dbURI } = require('../secrets');

const connector = 'node-postgres';

fastify.register(require('../'), { connectionString: dbURI, connector }, (err) =>
  fastify.log.error(err)
);

const drizzleConnectionInfo = (fastify) => {
  const drizzleClient = fastify.drizzle?.session.client;
  return {
    database: drizzleClient.database,
    connected: drizzleClient._connected,
    queryable: drizzleClient._queryable
  };
};

fastify.get('/', async (request, reply) => {
  const drizzle = drizzleConnectionInfo(fastify);
  console.log(drizzle);
  fastify.log.info(JSON.stringify(drizzle));
  return { drizzle };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
