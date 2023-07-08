const path = require('path');
const fs = require('fs/promises');

const getAvailableConnectors = async () => {
  const connectorsDir = path.join(__dirname, '../connectors');
  const connectors = (await fs.readdir(connectorsDir)).map((connector) => connector.split('.')[0]);
  return connectors;
};

const connectorInitializationErrorMessage = (connector) => {
  const msg = `An error occured initializing ${connector}`;
  return msg;
};

const invalidConnectorErrorMessage = async (connector, availableConnectors) => {
  const msg = `${connector} is not a supported connector. Please use one of the currently available connectors: [${availableConnectors.join(
    ', '
  )}]`;
  return msg;
};

const validateConnector = async (connector) => {
  const availableConnectors = await getAvailableConnectors();
  if (!connector || !availableConnectors.includes(connector.toLowerCase())) {
    throw new Error(invalidConnectorErrorMessage(connector, availableConnectors));
  }
};

const validateisPool = (isPool) => {
  if (isPool !== undefined && typeof isPool !== 'boolean') {
    throw new Error(`The isPool option must be a boolean.`);
  }
};

const REQUIRED_OPTIONS = [
  { name: 'connectionString', type: 'string' },
  { name: 'connector', type: 'string' }
];

const checkRequiredOptions = (opts) => {
  let passes;
  REQUIRED_OPTIONS.forEach((opt) => {
    const requiredOptPasses = opts[opt.name] !== undefined && typeof opts[opt.name] === opt.type;
    if (!requiredOptPasses) {
      passes = false;
    } else {
      passes = true;
    }
  });
  return passes;
};

const missingOptionsErrorMessage = () => {
  const msg = `Oops, looks like you forgot to pass your options. Missing one or more of the required options: [${REQUIRED_OPTIONS.map(
    (opt) => opt.name
  ).join(', ')}]`;
  return msg;
};

const validateOptions = async (opts) => {
  if (!opts || !checkRequiredOptions(opts)) {
    throw new Error(
      `Oops, looks like you forgot to pass your options. Missing one or more of the required options: [${REQUIRED_OPTIONS.map(
        (opt) => opt.name
      ).join(', ')}]`
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
  deriveConnector,
  getAvailableConnectors,
  missingOptionsErrorMessage,
  invalidConnectorErrorMessage,
  connectorInitializationErrorMessage
};
