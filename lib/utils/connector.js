const path = require('path');
const fs = require('fs/promises');

const getAvailableConnectors = async () => {
  const connectorsDir = path.join(__dirname, '../connectors');
  const connectors = (await fs.readdir(connectorsDir)).map((connector) => connector.split('.')[0]);
  return connectors;
};

const validateConnector = async (connector) => {
  const availableConnectors = await getAvailableConnectors();
  if (!connector || !availableConnectors.includes(connector.toLowerCase())) {
    throw new Error(
      `${connector} is not a supported connector. Please use one of the currently available connectors: [${availableConnectors.join(
        ', '
      )}]`
    );
  }
};

const validateisPool = (isPool) => {
  if (isPool !== undefined && typeof isPool !== 'boolean') {
    throw new Error(`The isPool option must be a boolean.`);
  }
};

const validateOptions = async (opts) => {
  if (!opts || !opts.connectionString || !opts.connector) {
    throw new Error(
      `Oops, looks like you forgot to pass your options. connectionString and connector are required properties`
    );
  }
  await validateConnector(opts.connector);
  validateisPool(opts.isPool);
};

const getConnector = (opts) => {
  const connector = require(`../connectors/${opts.connector}`);
  return connector(opts);
};

const deriveConnector = async (opts) => {
  const validateOpts = await validateOptions(opts);
  return getConnector(opts);
};

module.exports = {
  deriveConnector
};
