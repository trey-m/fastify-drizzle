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
// example node-postgres options object
const opts = {
  connectionString: 'postgresql://username:password@host:port/dbname', // required
  connector: 'node-postgres', // required - supported connectors are [node-postgres, postgresjs, neon, sqlite]
  alias: '' // optional
};

fastify.register(require('fastify-drizzle'), opts, (err) => console.error(err));

fastify.get('/', (request, reply) => {
  const drizzle = fastify.drizzle; // Drizzle instance
  console.log(drizzle);
});
```

The SQLite connector can work with both a local database file and a remote [Turso](https://turso.tech/) database.

```javascript
// local database
const sqliteOpts = {
  connectionString: 'file:/path/to/my.db',
  connector: 'sqlite'
};

// Turso
const tursoOpts = {
  connectionString: '{TURSO_DATABASE_URL}',
  authToken: '{TURSO_AUTH_TOKEN}',
  connector: 'sqlite'
};
```

## Contributing

See an opportunity to extend this package? Pull requests are encouraged! Please include test coverage.

## License

Licensed under [MIT](./LICENSE).
