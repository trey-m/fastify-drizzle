# Fastify Drizzle Plugin

![Test](https://github.com/trey-m/fastify-drizzle/workflows/Test/badge.svg)

[![NPM](https://nodei.co/npm/fastify-drizzle.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/fastify-drizzle/)

Fastify plugin to conveniently use [Drizzle](https://orm.drizzle.team) across your application.

## Installation

```bash
npm install fastify-drizzle
```

## Usage

```javascript
const opts = {
  connectionString: '', // required
  connector: '', // required - supported connectors are [node-postgres, postgresjs, neon]
  alias: '' // optional
};

fastify.register(require('fastify-drizzle'), opts, (err) => console.error(err));

fastify.get('/', (request, reply) => {
  const drizzle = fastify.drizzle; // Drizzle instance
  console.log(drizzle);
});
```

## Contributing

See an opportunity to extend this package? Pull requests are encouraged! Please include test coverage.

## License

Licensed under [MIT](./LICENSE).
