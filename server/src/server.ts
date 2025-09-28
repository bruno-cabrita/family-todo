import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import api from './api/index.ts'

declare module 'hono' {
  interface ContextVariableMap {
    auth?: {
      userId: string
      abilities: string[]
    }
  }
}

const distPath = '../client/dist'

const app = new Hono()

app.route('/api', api)
app.use('/*', serveStatic({ root: `${distPath}/` }))
app.get('*', serveStatic({ path: `${distPath}/index.html` })) // Fallsback to VueRouter

export default { port: 4200, fetch: app.fetch }
