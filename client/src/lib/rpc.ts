import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { RouterClient, RPCRouter } from '@scope/server/types'

const link = new RPCLink({
  url: () => new URL('/api', globalThis.location.href),
})

export const rpc: RouterClient<RPCRouter> = createORPCClient(link)
