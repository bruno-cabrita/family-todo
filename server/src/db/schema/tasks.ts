import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { ulid } from 'ulid'
import { timestamp } from '../utils.ts'
import { users } from './users.ts'

export const tasks = sqliteTable('tasks', {
  id: text({ length: 26 })
    .primaryKey()
    .$defaultFn(() => ulid()),
  label: text().notNull(),
  urgency: integer().default(0),
  completedAt: text(),
  attributedToId: text({ length: 26 })
    .notNull()
    .references(() => users.id),
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

export const tasksRelations = relations(tasks, ({ one }) => ({
  createdBy: one(users, {
    fields: [tasks.createdById],
    references: [users.id],
  }),
  attributedTo: one(users, {
    fields: [tasks.attributedToId],
    references: [users.id],
  }),
}))
