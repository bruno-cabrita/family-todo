import env from '../env.ts'
import seedProd from './seeds/prod.ts'
import seedDev from './seeds/dev.ts'

await seedProd()
if (env.ENVIRONMENT === 'development') seedDev()
