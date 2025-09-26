import { DateTime } from 'luxon'
import { z } from 'zod'

export function round(numb: number, decimalHouses: number = 0) {
  const pow = Math.pow(10,decimalHouses)
  return Math.round(numb * pow) / pow
}

export function isEmail(email?: string): boolean {
  return z.email().safeParse(email).success
}

export function isAuthCode(code?: string): boolean {
  if (!code) return false
  return /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{3}$/.test(code.toUpperCase())
}

export function formatDate(dateStr: string, options?: { hideTime?: boolean, showSeconds?: boolean }): string | undefined {
  if (!dateStr) return undefined
  const date = DateTime.fromISO(dateStr).setLocale('pt')
  if (options?.hideTime)
    return date.toLocaleString(DateTime.DATE_SHORT)
  if(options?.showSeconds)
    return date.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
  return date.toLocaleString(DateTime.DATETIME_SHORT)
}
