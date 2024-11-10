'use strict';

const Fastify = require('fastify');
const t = require('tap');
const sinon = require('sinon');
const test = t.test;

const cleanup = () => {
  const fastify = Fastify();
  t.teardown(fastify.close.bind(fastify));
};

test('index.js', async (t) => {
  await t.test('registering succeeded', async (t) => {
    t.plan(1);

    const fastify = Fastify();

    const fastifyDrizzle = t.mock('..', {
      '../lib/utils/connector': {
        deriveConnector: () => ({
          session: {
            client: {
              end: () => {}
            }
          }
        })
      }
    });

    await fastify.register(fastifyDrizzle);

    t.equal(typeof fastify.drizzle, 'object');
  });

  await t.test('registering with alias', async (t) => {
    t.plan(2);

    const fastify = Fastify();

    const fastifyDrizzle = t.mock('..', {
      '../lib/utils/connector': {
        deriveConnector: () => ({
          session: {
            client: {
              end: () => {}
            }
          }
        })
      }
    });

    await fastify.register(fastifyDrizzle, {
      alias: 'foo'
    });

    t.equal(typeof fastify.foo, 'object');
    t.equal(typeof fastify.drizzle, 'undefined');
  });

  await t.test('registering failed', async (t) => {
    t.plan(1);

    const fastify = Fastify();

    const fastifyDrizzle = t.mock('..', {
      '../lib/utils/connector': {
        deriveConnector: () => {
          throw new Error();
        }
      }
    });

    t.rejects(() => fastify.register(fastifyDrizzle));
  });

  await t.test('closing succeeded', async (t) => {
    const mockEnd = sinon.fake();
    t.plan(2);

    const fastify = Fastify();

    const fastifyDrizzle = t.mock('..', {
      '../lib/utils/connector': {
        deriveConnector: () => ({
          session: {
            client: {
              end: mockEnd
            }
          }
        })
      }
    });

    await fastify.register(fastifyDrizzle);

    t.equal(mockEnd.callCount, 0);

    await fastify.close();

    t.equal(mockEnd.callCount, 1);
  });

  await t.test('closing does not throw if client does not have "end" method', async (t) => {
    const mockEnd = sinon.fake();
    t.plan(0);

    const fastify = Fastify();

    const fastifyDrizzle = t.mock('..', {
      '../lib/utils/connector': {
        deriveConnector: () => ({
          session: {
            client: {}
          }
        })
      }
    });

    await fastify.register(fastifyDrizzle);
    await fastify.close();
  });

  await t.test('closing with alias succeeded', async (t) => {
    const mockEnd = sinon.fake();
    t.plan(2);

    const fastify = Fastify();

    const fastifyDrizzle = t.mock('..', {
      '../lib/utils/connector': {
        deriveConnector: () => ({
          session: {
            client: {
              end: mockEnd
            }
          }
        })
      }
    });

    await fastify.register(fastifyDrizzle, {
      alias: 'foo'
    });

    t.equal(mockEnd.callCount, 0);

    await fastify.close();

    t.equal(mockEnd.callCount, 1);
  });
  cleanup();
});
