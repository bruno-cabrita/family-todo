import { ORPCError, os } from '@orpc/server'
import type { HonoContext } from '../types.ts'
import { getAccessCookie } from './cookies.ts'
import { db } from '../db/db.ts'

export const rpcPublic = os.$context<HonoContext>()

const authMiddleware = rpcPublic.middleware(async ({ context, next }) => {
  const accessCookie = await getAccessCookie(context.honoContext)

  if (!accessCookie || typeof accessCookie != 'string') {
    context.honoContext.set('auth', undefined)
    return next()
  }

  const accessToken = await db.query.userAccessTokens.findFirst({
    where: ({ token }, { eq }) => eq(token, accessCookie),
  })

  if (!accessToken) {
    context.honoContext.set('auth', undefined)
    return next()
  }

  const user = await db.query.users.findFirst({
    columns: { id: true },
    with: { role: true },
    where: ({ id }, { eq }) => eq(id, accessToken.userId),
  })

  if (!user) {
    context.honoContext.set('auth', undefined)
    return next()
  }

  context.honoContext.set('auth', {
    userId: user.id,
    abilities: user.role.abilities,
  })

  return next()
})

const requireGuest = rpcPublic.middleware(({ context, next }) => {
  if (context.honoContext.var.auth?.userId) {
    throw new ORPCError('UNAUTHORIZED', { message: 'Não tens permissão para executares esta ação.' })
  }
  return next()
})

export const rpcGuest = rpcPublic
  .use(authMiddleware)
  .use(requireGuest)

const requireAuth = rpcPublic.middleware(({ context, next }) => {
  if (!context.honoContext.var.auth?.userId) {
    throw new ORPCError('UNAUTHORIZED', { message: 'Não tens permissão para executares esta ação.' })
  }
  return next()
})

const requireAbility = rpcPublic.middleware(({ procedure, context, next }) => {
  /* @ts-ignore */
  const ability = procedure['~orpc'].meta.requiresAbility

  if (!ability) {
    throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'Esta ação tem de ter uma permissão defenida.' })
  }

  if (!context.honoContext.var.auth?.abilities.includes(ability)) {
    throw new ORPCError('UNAUTHORIZED', { message: 'Não tens permissão para executares esta ação.' })
  }

  return next()
})

export const rpcAuth = rpcPublic
  .use(authMiddleware)
  .use(requireAuth)

export const rpcAuthAbility = rpcAuth
  .use(requireAbility)
