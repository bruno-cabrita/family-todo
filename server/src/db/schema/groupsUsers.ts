import { relations } from 'drizzle-orm'
import { sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { users } from './users.ts'
import { groups } from './groups.ts'

export const groupsUsers = sqliteTable('groupsUsers', {
  groupId: text({ length: 26 })
    .notNull()
    .references(() => groups.id),
  userId: text({ length: 26 })
    .notNull()
    .references(() => users.id),
}, (t) => [
  unique().on(t.groupId, t.userId),
])

export const groupsUsersRelations = relations(groupsUsers, ({ one }) => ({
  group: one(groups, {
    fields: [groupsUsers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupsUsers.userId],
    references: [users.id],
  }),
}))
