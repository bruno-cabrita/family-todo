import { ORPCError } from '@orpc/server'
import { z } from 'zod'
import { rpcAuth } from '../lib/rpc.ts'
import { db } from '../db/db.ts'
import { invitations } from '../db/schemas.ts'

const routes = {

  create: rpcAuth
    .input(z.object({
      email: z.email().toLowerCase(),
      groupId: z.string().optional(),
    }))
    .output(
      z.boolean(),
    )
    .handler(async ({ input, context }) => {
      const createdById = context.honoContext.var.auth?.userId

      if (!createdById) throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'No userId found in context.' })

      const res = (await db
        .insert(invitations)
        .values({
          email: input.email,
          groupId: input.groupId,
          createdById,
        })
        .returning({ id: invitations.id }))[0]
      
      if (!res) throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'Error creating invitation.' })

      return true
    }),

}

export default routes
