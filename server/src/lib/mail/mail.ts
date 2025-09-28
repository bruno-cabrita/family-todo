import { MailtrapClient } from 'mailtrap'
import type { Address } from 'mailtrap'
import env from '../../env.ts'

export type Mail = {
  to: Address[]
  bcc?: Address[]
  subject: string
  text: string
  html: string
  category?: string
}

const mailtrapClient = new MailtrapClient({
  token: env.MAILTRAP_API_KEY,
})

export const sender = {
  email: env.MAILTRAP_SENDER_EMAIL,
  name: env.MAILTRAP_SENDER_EMAIL,
}

export async function sendMail({
  to,
  bcc,
  subject,
  text,
  html,
  category,
}: Mail) {
  try {
    const res = await mailtrapClient.send({
      from: sender,
      to,
      bcc,
      subject,
      text,
      html,
      category,
    })
    return res
  } catch (reason) {
    return { success: false, error: reason }
  }
}

export { sendAuthCodeMail } from './mails/authCode.ts'
