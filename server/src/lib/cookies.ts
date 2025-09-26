import type { Context } from 'hono'
import {
  deleteCookie,
  getSignedCookie,
  setSignedCookie,
} from 'hono/cookie'
// import type { CookieOptions } from 'hono/cookie' // not exported somehow
import { ACCESS_TOKEN_EXPIRATION, AUTH_TOKEN_EXPIRATION } from '../consts.ts'
import { addSecondsToDate } from '../utils.ts'
import env from '../env.ts'

type PartitionedCookieConstraint =
  | {
      partitioned: true
      secure: true
    }
  | {
      partitioned?: boolean
      secure?: boolean
    }

type CookiePrefixOptions = 'host' | 'secure'

type CookieOptions = {
  domain?: string
  expires?: Date
  httpOnly?: boolean
  maxAge?: number
  path?: string
  secure?: boolean
  signingSecret?: string
  sameSite?: 'Strict' | 'Lax' | 'None' | 'strict' | 'lax' | 'none'
  partitioned?: boolean
  priority?: 'Low' | 'Medium' | 'High'
  prefix?: CookiePrefixOptions
} & PartitionedCookieConstraint


const COOKIES_SECRET = env.COOKIES_SECRET

const AUTH_COOKIE_NAME = 'auth-token'
const ACCESS_COOKIE_NAME = 'access-token'

const AUTH_COOKIE_OPTIONS: CookieOptions = {
  path: '/api',
  secure: true,
  httpOnly: true,
  maxAge: AUTH_TOKEN_EXPIRATION,
  expires: addSecondsToDate(new Date(), AUTH_TOKEN_EXPIRATION),
  sameSite: 'Strict',
}

const ACCESS_COOKIE_OPTIONS: CookieOptions = {
  path: '/api',
  secure: true,
  httpOnly: true,
  maxAge: ACCESS_TOKEN_EXPIRATION,
  expires: addSecondsToDate(new Date(), ACCESS_TOKEN_EXPIRATION),
  sameSite: 'Strict',
}

export async function setAuthCookie(c: Context, token: string): Promise<boolean> {
  await setSignedCookie(c, AUTH_COOKIE_NAME, token, COOKIES_SECRET, AUTH_COOKIE_OPTIONS)
  return true
}

export async function getAuthCookie(c: Context): Promise<string | boolean | undefined> {
  return await getSignedCookie(c, COOKIES_SECRET, AUTH_COOKIE_NAME)
}

export function deleteAuthCookie(c: Context): string | undefined {
  return deleteCookie(c, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS)
}

export async function setAccessCookie(c: Context, token: string): Promise<boolean> {
  await setSignedCookie(c, ACCESS_COOKIE_NAME, token, COOKIES_SECRET, ACCESS_COOKIE_OPTIONS)
  return true
}

export async function getAccessCookie(c: Context): Promise<string | boolean | undefined> {
  return await getSignedCookie(c, COOKIES_SECRET, ACCESS_COOKIE_NAME)
}

export function deleteAccessCookie(c: Context): string | undefined {
  return deleteCookie(c, ACCESS_COOKIE_NAME, ACCESS_COOKIE_OPTIONS)
}
