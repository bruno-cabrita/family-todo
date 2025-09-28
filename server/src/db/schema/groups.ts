import { relations } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { ulid } from 'ulid'
import { timestamp } from '../utils.ts'
import { users } from './users.ts'
import { groupsUsers } from './groupsUsers.ts'

export const groups = sqliteTable('groups', {
  id: text({ length: 26 })
    .primaryKey()
    .$defaultFn(() => ulid()),
  label: text().notNull(),
  createdById: text({ length: 26 })
    .notNull()
    .references(() => users.id),
  createdAt: text()
    .notNull()
    .$defaultFn(() => timestamp()),
  updatedAt: text()
    .notNull()
    .$defaultFn(() => timestamp()),
  deletedAt: text(),
})

export const groupsRelations = relations(groups, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [groups.createdById],
    references: [users.id],
  }),
  groupsUsers: many(groupsUsers),
}))
