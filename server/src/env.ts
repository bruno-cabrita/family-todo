import { z, ZodError } from 'zod'
import 'dotenv/config'

const env = process.env

const EnvSchema = z.object({
  ENVIRONMENT: z.string().default('development'),
  HMAC_KEY: z.string(),
  COOKIES_SECRET: z.string(),
  DB_FILE_NAME: z.string(),
  MAILTRAP_API_KEY: z.string(),
  MAILTRAP_SENDER_EMAIL: z.string(),
  MAILTRAP_SENDER_NAME: z.string(),
})

export type EnvSchema = z.infer<typeof EnvSchema>

try {
  EnvSchema.parse(env)
} catch (error) {
  if (error instanceof ZodError) {
    let message = 'Missing required values in .env:\n'
    error.issues.forEach((issue) => {
      message += `${String(issue.path[0])}\n`
    })
    const e = new Error(message)
    e.stack = ''
    throw e
  } else {
    console.error(error)
  }
}

export default EnvSchema.parse(env)
