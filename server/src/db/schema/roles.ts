import { relations } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { users } from './users.ts'

export const roles = sqliteTable('roles', {
  id: text({ length: 26 }).primaryKey(),
  label: text().notNull().unique(),
  abilities: text({ mode: 'json' }).notNull().$type<string[]>().default([]),
})

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}))
