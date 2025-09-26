import { db } from '../db.ts'
import { users } from '../schemas.ts'

/**
 * Users
 */
type UsersInsert = typeof users.$inferInsert
const newUsers: UsersInsert[] = [
  {
    name: 'Administrador',
    email: 'admin@example.com',
    roleId: 'admin',
  },
  {
    name: 'Utilizador',
    email: 'user@example.com',
    roleId: 'user',
  },
]

async function seedUsers() {
  await db.insert(users).values([...newUsers])
  console.log('Users seeded!')
}

async function seedAll() {
  await seedUsers()
}

export default seedAll
