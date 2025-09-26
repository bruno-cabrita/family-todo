import { drizzle } from 'drizzle-orm/libsql'
import env from '../env.ts'
import * as schema from './schemas.ts'

const db = drizzle({
  schema,
  connection: { url: `${env.DB_FILE_NAME}` },
})

export { db }
