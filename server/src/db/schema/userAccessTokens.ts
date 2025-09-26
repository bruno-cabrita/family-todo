import { relations } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { ulid } from 'ulid'
import { ACCESS_TOKEN_EXPIRATION } from '../../consts.ts'
import { generateToken, timestamp } from '../utils.ts'
import { users } from './users.ts'

export const userAccessTokens = sqliteTable('userAccessTokens', {
  id: text({ length: 26 })
    .primaryKey()
    .$defaultFn(() => ulid()),
  userId: text({ length: 26 })
    .notNull()
    .references(() => users.id),
  token: text({ length: 64 })
    .notNull()
    .$defaultFn(() => generateToken()),
  lastUsedAt: text()
    .notNull()
    .$defaultFn(() => timestamp()),
  expiresAt: text()
    .notNull()
    .$defaultFn(() => timestamp(ACCESS_TOKEN_EXPIRATION)),
  createdAt: text()
    .notNull()
    .$defaultFn(() => timestamp()),
  updatedAt: text()
    .notNull()
    .$defaultFn(() => timestamp()),
})

export const userAccessTokensRelations = relations(userAccessTokens, ({ one }) => ({
  user: one(users, {
    fields: [userAccessTokens.userId],
    references: [users.id],
  }),
}))
