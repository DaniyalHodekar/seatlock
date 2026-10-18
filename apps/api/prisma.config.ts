import { defineConfig } from 'prisma/config';
import { existsSync } from 'node:fs';

// CI and production set real env vars and have no .env file.
if (existsSync('.env')) process.loadEnvFile();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
