import { eq } from 'drizzle-orm'
import { db } from '../db.ts'
import { roles } from '../schemas.ts'

/**
 * Roles
 */
type RolesInsert = typeof roles.$inferInsert
const newRoles: RolesInsert[] = [
  {
    id: 'admin',
    label: 'Administrador',
    abilities: [
      'users:list',
      'users:create',
      'users:read',
      'users:update',
    ],
  },
  {
    id: 'user',
    label: 'Utilizador',
    abilities: [
      //
    ],
  },
]

export const rolesIds = newRoles.map((role: RolesInsert) => role.id)

async function seed() {
  await Promise.allSettled(newRoles.map(async (role: RolesInsert) => {
    const rowExists = await db.$count(roles, eq(roles.id, role.id))
    if (rowExists) {
      const { id, ...rest } = role
      await db
        .update(roles)
        .set(rest)
        .where(eq(roles.id, id))
    } else {
      await db
        .insert(roles)
        .values(role)
    }
  }))

  console.log('Roles seeded!')
}

export default seed
