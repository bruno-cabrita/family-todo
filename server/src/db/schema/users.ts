import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { ulid } from 'ulid'
import { timestamp } from '../utils.ts'
import { roles } from './roles.ts'
import { userAccessTokens } from './userAccessTokens.ts'
import { userAuthTokens } from './userAuthTokens.ts'
import { groupsUsers } from './groupsUsers.ts'

export const users = sqliteTable('users', {
  id: text({ length: 26 })
    .primaryKey()
    .$defaultFn(() => ulid()),
  name: text().notNull(),
  email: text().notNull().unique(),
  roleId: text({ length: 26 })
    .notNull()
    .references(() => roles.id),
  active: integer({ mode: 'boolean' }).notNull().default(true),
  createdAt: text()
    .notNull()
    .$defaultFn(() => timestamp()),
  updatedAt: text()
    .notNull()
    .$defaultFn(() => timestamp()),
  deletedAt: text(),
})

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  accessTokens: many(userAccessTokens),
  authTokens: many(userAuthTokens),
  groupsUsers: many(groupsUsers),
}))
