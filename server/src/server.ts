import { Hono } from 'hono'
import { serveStatic } from 'hono/deno'
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
app.get('*', async (c) => c.html(await Deno.readTextFile(`${rootDistPath}/index.html`)))

Deno.serve({ port: 4200 }, app.fetch)
