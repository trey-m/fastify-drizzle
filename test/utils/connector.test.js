'use strict';

const Fastify = require('fastify');
const t = require('tap');
const test = t.test;
const {
  missingOptionsErrorMessage,
  invalidConnectorErrorMessage,
  getAvailableConnectors,
  connectorInitializationErrorMessage
} = require('../../lib/utils/connector');

test('connector.js', async (t) => {
  await t.test('no options passed', async (t) => {
    t.plan(1);

    const fastify = Fastify();
    t.teardown(fastify.close.bind(fastify));

    const expectedErr = missingOptionsErrorMessage();

    await t.rejects(fastify.register(require('../../')), new Error(expectedErr));
  });

  await t.test('connectionString required', async (t) => {
    t.plan(1);

    const fastify = Fastify();
    t.teardown(fastify.close.bind(fastify));

    const connector = (await getAvailableConnectors())[0];
    const expectedErr = missingOptionsErrorMessage();

    await t.rejects(fastify.register(require('../../'), { connector }), new Error(expectedErr));
  });

  await t.test('connector required', async (t) => {
    t.plan(1);

    const fastify = Fastify();
    t.teardown(fastify.close.bind(fastify));

    const expectedErr = missingOptionsErrorMessage();

    await t.rejects(fastify.register(require('../../'), { connectionString: '' }), new Error(expectedErr));
  });

  await t.test('connector must be valid', async (t) => {
    t.plan(1);

    const fastify = Fastify();
    t.teardown(fastify.close.bind(fastify));

    const availableConnectors = await getAvailableConnectors();
    const connector = 'foo';
    const expectedErr = invalidConnectorErrorMessage(connector, availableConnectors);

    await t.rejects(fastify.register(require('../../'), { connector, connectionString: '' }), new Error(expectedErr));
  });

  await t.test('connector fails to initialize', async (t) => {
    t.plan(1);

    const fastify = Fastify();
    t.teardown(fastify.close.bind(fastify));

    const connector = (await getAvailableConnectors())[0];
    const expectedErr = connectorInitializationErrorMessage(connector);

    await t.rejects(
      fastify.register(require('../../'), { connector, connectionString: 'foo' }),
      new Error(expectedErr)
    );
  });
});
