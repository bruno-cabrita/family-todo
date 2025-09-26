import { RPCHandler } from '@orpc/server/fetch'
import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import roles from './roles.ts'
import users from './users.ts'
import auth from './auth.ts'
import altcha from './altcha.ts'

const api = new Hono()

api.use(secureHeaders())

const rpcRouter = {
  altcha: {...altcha},
  auth: {...auth},
  users: {...users},
  roles: {...roles},
}

export type RPCRouter = typeof rpcRouter

const handler = new RPCHandler(rpcRouter)

api.use('/*', async (c, next) => {
  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: '/api',
    context: { honoContext: c },
  })

  if(matched) return c.newResponse(response.body, response)

  await next()
})

export default api
