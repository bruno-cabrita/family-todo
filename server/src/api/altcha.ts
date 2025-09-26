import { ORPCError } from '@orpc/server'
import { createChallenge } from 'altcha-lib'
import { z } from 'zod'
import env from '../env.ts'
import { rpcGuest } from '../lib/rpc.ts'

// altcha-lib does not exports Challenge type.
type Challenge = Awaited<ReturnType<typeof createChallenge>>

const hmacKey = env.HMAC_KEY

const ChallengeSchema = z.custom<Challenge>()

const routes = {
  challenge: rpcGuest
    .output(ChallengeSchema)
    .handler(async () => {
      const res = await createChallenge({ hmacKey, maxNumber: 100000 })

      if (!res)
        throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'Error creating Altcha challenge.' })

      return res
    })
}

export default routes
