import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { rpcAuth, rpcAuthAbility } from '../lib/rpc.ts'
import { db } from '../db/db.ts'
import { roles } from '../db/schemas.ts'

const routes = {
  list: rpcAuth
    .output(
      z.object({
        id: z.string(),
        label: z.string(),
      }).array(),
    )
    .handler(async () => {
      return await db.query.roles.findMany({
        columns: { id: true, label: true },
      })
    }),

  listDetailed: rpcAuthAbility
    .meta({ requiresAbility: 'roles:update' })
    .output(
      z.object({
        id: z.string(),
        label: z.string(),
        abilities: z.string(),
      }).array(),
    )
    .handler(async () => {
      const roles = await db.query.roles.findMany()

      return roles.map((role) => {
        const { abilities, ...rest } = role
        return {
          ...rest,
          abilities: abilities.join(','),
        }
      })
    }),

  update: rpcAuthAbility
    .meta({ requiresAbility: 'roles:update' })
    .input(
      z.object({
        id: z.string(),
        label: z.string(),
        abilities: z.string(),
      }).array(),
    )
    .output(z.boolean())
    .handler(async ({ input }) => {
      for await (const role of input) {
        await db
          .update(roles)
          .set({
            abilities: role.abilities.replace(' ', '').split(','),
          })
          .where(eq(roles.id, role.id))
      }

      return true
    }),
}

export default routes
