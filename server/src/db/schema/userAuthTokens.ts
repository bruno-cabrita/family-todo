import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { ulid } from 'ulid'
import { AUTH_TOKEN_EXPIRATION } from '../../consts.ts'
import { generateAuthCode, generateToken, timestamp } from '../utils.ts'
import { users } from './users.ts'

export const userAuthTokens = sqliteTable('userAuthTokens', {
  id: text({ length: 26 })
    .primaryKey()
    .$defaultFn(() => ulid()),
  userId: text({ length: 26 })
    .notNull()
    .references(() => users.id),
  token: text({ length: 64 })
    .notNull()
    .$defaultFn(() => generateToken()),
  code: text({ length: 6 })
    .notNull()
    .$defaultFn(() => generateAuthCode()),
  attempts: integer({ mode: 'number' }).notNull().default(3),
  expiresAt: text()
    .notNull()
    .$defaultFn(() => timestamp(AUTH_TOKEN_EXPIRATION)),
  createdAt: text()
    .notNull()
    .$defaultFn(() => timestamp()),
  updatedAt: text()
    .notNull()
    .$defaultFn(() => timestamp()),
})

export const userAuthTokensRelations = relations(userAuthTokens, ({ one }) => ({
  user: one(users, {
    fields: [userAuthTokens.userId],
    references: [users.id],
  }),
}))
