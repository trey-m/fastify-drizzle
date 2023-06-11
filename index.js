'use strict';

const fastifyPlugin = require('fastify-plugin');
const { deriveConnector } = require('./lib/utils/connector');

async function fastifyDrizzle(fastify, opts, next) {
  try {
    const connector = await deriveConnector(opts);
    const alias = opts?.alias ? opts.alias : 'drizzle';

    fastify.decorate(alias, connector).addHook('onClose', (instance, done) => {
      if (instance[alias] === connector) {
        console.log(`Drizzle is shutting down [onCloseHook]`);
      }
      done();
    });

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = fastifyPlugin(fastifyDrizzle);
