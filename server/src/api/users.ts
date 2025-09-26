// import { ORPCError } from '@orpc/server'
// import { z } from 'zod'
// import { rpcAuthAbility, rpcAuth } from '../lib/rpc.ts'
// import { db } from '../db/db.ts'
// import {
//   users,
//   roles,
//   userAccessTokens,
// } from '../db/schemas.ts'
// import { timestamp } from '../utils.ts'

const routes = {

  // update: rpcAuthAbility
  //   .meta({ requiresAbility: 'users:update' })
  //   .input(z.object({
  //     id: z.string(),
  //     name: z.string(),
  //     email: z.email().lowercase(),
  //     roleId: z.enum(['owner', 'admin', 'user'])
  //   }))
  //   .output(z.boolean())
  //   .handler(async ({ input, context }) => {
  //     const { id, ...rest } = input
      
  //     if(rest.roleId === 'owner') {
  //       const userAbilities = context.honoContext.var.auth?.abilities
  //       if(!userAbilities?.includes('users:update-owner'))
  //         throw new ORPCError('FORBIDDEN', { message: `You don't have permisisons.` })
  //     }

  //     const res = (await db
  //       .update(users)
  //       .set(rest)
  //       .where(eq(users.id, id))
  //       .returning({ id: users.id})).at(0)

  //     return !!res
  //   }),

  // list: rpcAuthAbility
  //   .meta({ requiresAbility: 'users:list' })
  //   .input(z.object({
  //     pagination: PaginationSchema,
  //   }))
  //   .handler(async ({ input }) => {
  //     const data = await getPaginatedUsers(input.pagination)

  //     if(!data)
  //       throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'Error al listar usuarios.' })

  //     return data
  //   }),

  // import: rpcAuthAbility
  //   .meta({ requiresAbility: 'users:create' })
  //   .input(z.object({
  //     name: z.string(),
  //     email: z.email().toLowerCase(),
  //   }).array())
  //   .output(z.object({
  //     id: z.string(),
  //   }).array())
  //   .handler(async ({ input }) => {

  //     const payload = input.map((item) => ({
  //       ...item,
  //       roleId: 'user',
  //     }))

  //     const data = await db
  //       .insert(users)
  //       .values(payload)
  //       .returning({ id: users.id })

  //     if(!data)
  //       throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'Erro ao criar utilizadores.' })

  //     return data
  //   }),


}

export default routes