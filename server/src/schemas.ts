import { z } from 'zod'

export const AltchaPayloadSchema = z.object({
  number: z.number(),
  algorithm: z.enum(['SHA-1','SHA-256','SHA-512']),
  challenge: z.string(),
  salt: z.string(),
  signature: z.string(),
})