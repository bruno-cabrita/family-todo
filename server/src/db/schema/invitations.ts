import { relations } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { ulid } from 'ulid'
import { timestamp } from '../utils.ts'
import { users } from './users.ts'
import { groups } from './groups.ts'

export const invitations = sqliteTable('invitations', {
  id: text({ length: 26 })
    .primaryKey()
    .$defaultFn(() => ulid()),
  email: text().notNull(),
  groupId: text({ length: 26 })
    .references(() => groups.id),
  createdById: text({ length: 26 })
    .notNull()
    .references(() => users.id),
  createdAt: text()
    .notNull()
    .$defaultFn(() => timestamp()),
})

export const invitationsRelations = relations(invitations, ({ one }) => ({
  createdBy: one(users, {
    fields: [invitations.createdById],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [invitations.groupId],
    references: [groups.id],
  }),
}))
