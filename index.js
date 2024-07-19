'use strict';

const fastifyPlugin = require('fastify-plugin');
const { deriveConnector } = require('./lib/utils/connector');

async function fastifyDrizzle(fastify, opts) {
  try {
    const connector = await deriveConnector(opts);
    const alias = opts?.alias ? opts.alias : 'drizzle';

    fastify.decorate(alias, connector).addHook('onClose', (instance, done) => {
      const client = fastify[alias]?.session?.client;
      if (client) {
        fastify.log.info(`Drizzle client is disconnecting`);
        if (typeof client.end === 'function') {
          client.end();
        }
      }
      done();
    });
  } catch (err) {
    fastify.log.error(err.message, err.stack);
    throw new Error(err.message);
  }
}

module.exports = fastifyPlugin(fastifyDrizzle);
