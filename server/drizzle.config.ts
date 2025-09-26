import { defineConfig } from 'drizzle-kit'
import env from './src/env.ts'

export default defineConfig({
  schema: './src/db/schemas.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DB_FILE_NAME,
  },
})
