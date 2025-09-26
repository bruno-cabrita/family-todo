import { z } from 'zod'
import type { Context } from 'hono'
import { AltchaPayloadSchema } from './schemas.ts'

export type { RouterClient } from '@orpc/server'
export type { RPCRouter } from './api/index.ts'

export type AltchaPayload = z.infer<typeof AltchaPayloadSchema>

export type HonoContext = {
  honoContext: Context
}
