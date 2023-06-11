const fastify = require('fastify')({ logger: true });
const { dbURI } = require('../secrets');

const connector = 'node-postgres';

fastify.register(require('../'), { connectionString: dbURI, connector }, (err) => console.error(err));

fastify.get('/', async (request, reply) => {
  console.log('********: ', fastify.drizzle);
  return { hello: 'drizzle' };
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
