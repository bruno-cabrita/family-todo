import { defineStore } from 'pinia'
import { ref } from 'vue'
import { safe } from '@orpc/client'
import type { Payload } from 'altcha-lib/types'
import { STORAGE_AUTH_KEY } from './consts.ts'
import { rpc } from '../lib/rpc.ts'

type UserResponse = Awaited<ReturnType<typeof rpc.auth.confirm>>
type AuthResponse = Awaited<ReturnType<typeof rpc.auth.create>>

type SendAuthCodeResponse = {
  success: false
  error: string
} | {
  success: true
  data: AuthResponse
}

type SubmitAuthCodeResponse = {
  success: false
  error: string
  data?: AuthResponse
} | {
  success: true
  data: UserResponse
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<UserResponse | null>(null)

    async function sendAuthCode({ email, altcha }: { email?: string; altcha: Payload }): Promise<SendAuthCodeResponse> {
      if (!email) return { success: false, error: `Email missing.` }
      // if(!altcha) return { success: false, error: `Altcha missing.` }
      const { isSuccess, data, error } = await safe(rpc.auth.create({ email, altcha }))

      if (!isSuccess) {
        return {
          success: false,
          error: error.message,
        }
      }

      return { success: true, data }
    }

    async function submitAuthCode({ code }: { code: string }): Promise<SubmitAuthCodeResponse> {
      const { isSuccess, data, error, isDefined } = await safe(rpc.auth.confirm({ code }))

      if (!isSuccess) {
        if (!isDefined) {
          return {
            success: false,
            error: error.message,
          }
        } else {
          return {
            success: false,
            error: error.message,
            data: error.data,
          }
        }
      }

      user.value = data

      return {
        success: true,
        data,
      }
    }

    async function setAuthenticatedUser(): Promise<boolean> {
      const { isSuccess, data /*error, isDefined*/ } = await safe(rpc.auth.getUser())

      if (!isSuccess) {
        reset()
        return false
      }

      user.value = data

      return isSuccess
    }

    async function logout(): Promise<boolean> {
      const { isSuccess, data } = await safe(rpc.auth.logout())
      reset()
      if (!isSuccess) return false
      return data
    }

    const reset = () => {
      user.value = null
      localStorage.clear()
    }

    function hasAbility(ability: string): boolean {
      if (user.value?.role.abilities.includes(ability)) return true
      return false
    }

    return {
      user,
      sendAuthCode,
      submitAuthCode,
      setAuthenticatedUser,
      logout,
      reset,
      hasAbility,
    }
  },
  {
    persist: {
      key: STORAGE_AUTH_KEY,
    },
  },
)
