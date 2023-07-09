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

    try {
      await fastify.register(require('../../'));
    } catch (err) {
      const errStr = err.toString();
      const expectedErr = `Error: ${missingOptionsErrorMessage()}`;
      if (errStr === expectedErr) {
        t.match(errStr, expectedErr);
      }
    }
  });

  await t.test('connectionString required', async (t) => {
    t.plan(1);

    const fastify = Fastify();
    t.teardown(fastify.close.bind(fastify));

    const connector = (await getAvailableConnectors())[0];

    try {
      await fastify.register(require('../../'), { connector });
    } catch (err) {
      const errStr = err.toString();
      const expectedErr = `Error: ${missingOptionsErrorMessage()}`;
      if (errStr === expectedErr) {
        t.match(errStr, expectedErr);
      }
    }
  });

  await t.test('connector required', async (t) => {
    t.plan(1);

    const fastify = Fastify();
    t.teardown(fastify.close.bind(fastify));

    try {
      await fastify.register(require('../../'), { connectionString: '' });
    } catch (err) {
      const errStr = err.toString();
      const expectedErr = `Error: ${missingOptionsErrorMessage()}`;
      if (errStr === expectedErr) {
        t.match(errStr, expectedErr);
      }
    }
  });

  await t.test('connector must be valid', async (t) => {
    t.plan(1);

    const fastify = Fastify();
    t.teardown(fastify.close.bind(fastify));

    const connector = 'foo';
    try {
      await fastify.register(require('../../'), { connector, connectionString: 'foo' });
    } catch (err) {
      const availableConnectors = await getAvailableConnectors();
      const errStr = err.toString();
      const expectedErr = `Error: ${invalidConnectorErrorMessage(connector, availableConnectors)}`;
      if (errStr === expectedErr) {
        t.match(errStr, expectedErr);
      }
    }
  });

  await t.test('connector fails to initialize', async (t) => {
    t.plan(1);

    const fastify = Fastify();
    t.teardown(fastify.close.bind(fastify));

    const connector = (await getAvailableConnectors())[0];

    try {
      await fastify.register(require('../../'), { connector, connectionString: 'foo' });
    } catch (err) {
      const errStr = err.toString();
      const expectedErr = `Error: ${connectorInitializationErrorMessage(connector)}`;
      if (errStr === expectedErr) {
        t.match(errStr, expectedErr);
      }
    }
  });
});
