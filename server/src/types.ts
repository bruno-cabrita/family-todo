import type { Context } from 'hono'

export type { RouterClient } from '@orpc/server'
export type { RPCRouter } from './api/index.ts'

export type HonoContext = {
  honoContext: Context
}
