import { ORPCError } from '@orpc/server'
import { z } from 'zod'
import { rpcAuth } from '../lib/rpc.ts'
import { db } from '../db/db.ts'
import { groups } from '../db/schemas.ts'

const routes = {

  create: rpcAuth
    .input(z.object({
      label: z.string(),
    }))
    .output(z.object({
      id: z.string(),
      label: z.string(),
    }).array())
    .handler(async ({ input, context }) => {
      const createdById = context.honoContext.var.auth?.userId
      if (!createdById) throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'No userId found in context.' })

      const res = (await db
        .insert(groups)
        .values({
          label: input.label,
          createdById,
        })
        .returning({ id: groups.id }))[0]
      
      if (!res) throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'Error creating group.' })

      // @TODO: add user(self) to new group

      return await db.query.groups.findMany({
        columns: {
          id: true, label: true,
        }
      })
    }),

}

export default routes
