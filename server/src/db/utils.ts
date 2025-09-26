export { timestamp } from '../utils.ts'

const unambiguousChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const tokenChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const unambiguousCharsLength = unambiguousChars.length
const tokenCharsLength = tokenChars.length

export function generateToken(length: number = 64): string {
  const res = []
  for (let i = 0; i < length; i++) {
    res.push(tokenChars[Math.floor(Math.random() * tokenCharsLength)])
  }
  return res.join('')
}

export function generateAuthCode(length: number = 3): string {
  const res = []
  for (let i = 0; i < length; i++) {
    res.push(unambiguousChars[Math.floor(Math.random() * unambiguousCharsLength)])
  }
  return res.join('')
}
