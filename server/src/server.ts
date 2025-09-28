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
const rootDistPath = `${import.meta.dirname}/../${distPath}`

const app = new Hono()

app.route('/api', api)
app.use('/*', serveStatic({ root: `${distPath}/` }))

// Fallsback to VueRouter
app.get('*', serveStatic({ path: `${rootDistPath}/index.html` }))

export default {
  port: 4200,
  fetch: app.fetch,
}
