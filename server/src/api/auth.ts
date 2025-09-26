import { ORPCError } from '@orpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { verifySolution } from 'altcha-lib'
import {
  deleteAccessCookie,
  deleteAuthCookie,
  getAccessCookie,
  getAuthCookie,
  setAccessCookie,
  setAuthCookie,
} from '../lib/cookies.ts'
import { rpcAuth, rpcGuest } from '../lib/rpc.ts'
import { db } from '../db/db.ts'
import { userAccessTokens, userAuthTokens } from '../db/schemas.ts'
import { timestamp } from '../utils.ts'
import env from '../env.ts'
import { sendAuthCodeMail } from '../lib/mail.ts'

const routes = {

  create: rpcGuest
    .input(z.object({
      email: z.email().toLowerCase(),
      altcha: z.string(),
    }))
    .output(z.object({
      attempts: z.int().nonnegative(),
      expiresAt: z.string(),
    }))
    .handler(async ({ input, context }) => {

      const isAltchaValid = await verifySolution(input.altcha, env.HMAC_KEY)

      if(!isAltchaValid)
        throw new ORPCError('BAD_REQUEST', { message: 'Captcha incorrecto.' })

      const user = await db.query.users.findFirst({
        columns: { id: true },
        where: ({email, active, deletedAt}, {eq, and, isNull}) => and(
          eq(email, input.email),
          eq(active, true),
          isNull(deletedAt),
        ),
      })

      if(!user)
        throw new ORPCError('BAD_REQUEST', { message: 'Email incorrecto.' })

      await db.delete(userAuthTokens).where(eq(userAuthTokens.userId, user.id))

      const authToken = (await db
        .insert(userAuthTokens)
        .values({ userId: user.id })
        .returning({
          attempts: userAuthTokens.attempts,
          expiresAt: userAuthTokens.expiresAt,
          token: userAuthTokens.token,
          code: userAuthTokens.code,
        })
      ).at(0)

      if(!authToken)
        throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'Error al insertar el token de autenticación en la base de datos.' })

      const { attempts, expiresAt, token, code } = authToken

      if(env.ENVIRONMENT === 'development') {
        console.log('AUTH CODE:', code)
      } else {
        const mail = await sendAuthCodeMail({ code, to: input.email })
        if(!mail.success)
          throw new ORPCError('INTERNAL_SERVER_ERROR', { message: `Error sending mail notification to ${input.email}. ${mail.error}` })
      }

      const cookie = await setAuthCookie(context.honoContext, token)

      if (!cookie)
        throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'Error en la definición de la cookie.' })

      return { attempts, expiresAt }
    }),

  confirm: rpcGuest
    .input(z.object({
      code: z.string().toUpperCase(),
    }))
    .output(z.object({
      name: z.string(),
      email: z.email(),
      role: z.object({
        label: z.string(),
        abilities: z.string().array(),
      }),
    }))
    .errors({
      NOT_ACCEPTABLE: {
        message: 'Código incorrecto.',
        data: z.object({ 
          attempts: z.int().nonnegative(),
          expiresAt: z.string(),
        })
      }
    })
    .handler(async ({ input, context, errors }) => {

      const token = await getAuthCookie(context.honoContext)

      if (!token || typeof token !== 'string')
        throw new ORPCError('BAD_REQUEST', { message: 'No se ha encontrado auth token en las cookies.' })

      const authToken = await db.query.userAuthTokens.findFirst({
        columns: { id: true, expiresAt: true, code: true, attempts: true, userId: true },
        where: (userAuthTokens, {eq}) => eq(userAuthTokens.token, token)
      })
      
      if (!authToken)
        throw new ORPCError('BAD_REQUEST', { message: 'No se ha encontrado ningún auth token en la base de datos.' })
    
      if (authToken.expiresAt < timestamp())
        throw new ORPCError('TIMEOUT', { message: 'El token de autenticación ha caducado.' })
    
      if (authToken.code !== input.code) {
        if (authToken.attempts > 0) {
          const updatedAuthToken = (
            await db
              .update(userAuthTokens)
              .set({ attempts: authToken.attempts - 1, updatedAt: timestamp() })
              .where(eq(userAuthTokens.token, token))
              .returning({
                attempts: userAuthTokens.attempts,
                expiresAt: userAuthTokens.expiresAt,
              })
          ).at(0)
    
          if (!updatedAuthToken)
            throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'No se ha podido actualizar el auth token en la base de datos.' })

          const { attempts, expiresAt } = updatedAuthToken

          throw errors.NOT_ACCEPTABLE({ data: { attempts, expiresAt } })
        } else {
          await db.delete(userAuthTokens).where(eq(userAuthTokens.id, authToken.id))
          throw new ORPCError('TOO_MANY_REQUESTS', { message: 'Demasiados intentos.' })
        }
      } else {
        await db.delete(userAuthTokens).where(eq(userAuthTokens.id, authToken.id))

        deleteAuthCookie(context.honoContext)

        const user = await db.query.users.findFirst({
          columns: { name: true, email: true },
          with: {
            role: {
              columns: { label: true, abilities: true }
            },
          },
          where: ({id, active, deletedAt}, {eq, and, isNull}) => and(
            eq(id, authToken.userId),
            eq(active, true),
            isNull(deletedAt),
          )
        })
    
        if (!user)
          throw new ORPCError('BAD_REQUEST', { message: 'Usuario no encontrado.' })

        const accessToken = (await db
          .insert(userAccessTokens)
          .values({ userId: authToken.userId })
          .returning({
            id: userAccessTokens.id,
            userId: userAccessTokens.userId,
            token: userAccessTokens.token,
          })
        ).at(0)

        if (!accessToken)
          throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'No se ha podido insertar el token de acceso en la base de datos.' })

        // delete all previous access tokens
        // a.k.a there's only one active session per user
        // await db
        //   .delete(userAccessTokens)
        //   .where(and(
        //     eq(userAccessTokens.userId, accessToken.userId),
        //     ne(userAccessTokens.id, accessToken.id)
        //   ))

        const cookie = await setAccessCookie(context.honoContext, accessToken.token)

        if (!cookie)
          throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'No se ha podido establecer la cookie de token de acceso.' })

        return user
      }
    }),

  logout: rpcAuth
    .output(z.boolean())
    .handler(async ({context}) => {

      const accessTokenCookie = await getAccessCookie(context.honoContext)

      if(!accessTokenCookie || typeof accessTokenCookie !== 'string')
        throw new ORPCError('BAD_REQUEST', { message: 'No se ha encontrado el token de acceso en las cookies.' })

      deleteAccessCookie(context.honoContext)

      await db
        .delete(userAccessTokens)
        .where(eq(userAccessTokens.token, accessTokenCookie))

      return true
    }),

  getUser: rpcAuth
    .output(z.object({
      name: z.string(),
      email: z.email(),
      role: z.object({
        label: z.string(),
        abilities: z.string().array(),
      }),
    }))
    .handler(async ({context}) => {

      const token = await getAccessCookie(context.honoContext)

      if (!token || typeof token !== 'string')
        throw new ORPCError('BAD_REQUEST', { message: 'No se ha encontrado el token de acceso en las cookies.' })

      const accessToken = await db.query.userAccessTokens.findFirst({
        columns: { expiresAt: true, userId: true },
        where: (userAccessTokens, {eq}) => (eq(userAccessTokens.token, token))
      })
  
      if (!accessToken || accessToken.expiresAt < timestamp())
        throw new ORPCError('BAD_REQUEST', { message: 'No se ha encontrado el token de acceso en la base de datos.' })

      const user = await db.query.users.findFirst({
        columns: { email: true, name: true },
        with: {
          role: {
            columns: { label: true, abilities: true },
          },
        },
        where: ({id, active, deletedAt}, {eq, and, isNull}) => and(
          eq(id, accessToken.userId),
          eq(active, true),
          isNull(deletedAt),
        ),
      })

      if (!user)
        throw new ORPCError('BAD_REQUEST', { message: 'Usuario no encontrado.' })

      return user
    }),

}

export default routes