import { sendMail } from '../mail.ts'

type MailBody = {
  code: string,
}

export async function sendAuthCodeMail({ to, ...body }: MailBody & { to: string }) {
  return await sendMail({
    to: [{email: to}],
    subject: 'Código de autenticación',
    text: `¡Estás a punto de tener más fuerza para explorar!\n\nTu código de autenticación para la app Friso: ${body.code}\n\nSi no hiciste este pedido, ignora este mensaje e informa al técnico responsable.`,
    html: getEmailHTML(body)
  })
}

function getEmailHTML(body: MailBody) {
  return `<!doctype html><html lang="pt-PT" dir="auto" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title>Código de autenticación</title><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style type="text/css">#outlook a,body{padding:0}body{margin:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0}img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}p{display:block;margin:13px 0}</style><!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]--><!--[if lte mso 11]>
    <style type="text/css">
      .mj-outlook-group-fix { width:100% !important; }
    </style>
    <![endif]--><style type="text/css">@media only screen and (min-width:480px){.mj-column-per-100{max-width:100%;width:100%!important}}</style><style media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100{max-width:100%;width:100%!important}</style></head><body style="background-color:#f6f6f6;word-spacing:normal"> <div style="color:#fff;display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">Código de autenticación</div> <div style="background-color:#f6f6f6" lang="pt-PT" dir="auto"> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:480px;" width="480" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--> <div style="margin:0 auto;max-width:480px"> <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%"> <tbody> <tr> <td style="direction:ltr;font-size:0;padding:20px 0;text-align:center"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr></tr></table><![endif]--> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:480px;" width="480" bgcolor="#FFFFFF" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--> <div style="background:#fff;background-color:#fff;margin:0 auto;max-width:480px"> <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff;background-color:#fff;width:100%"> <tbody> <tr> <td style="border:1px solid #45b6f6;direction:ltr;font-size:0;padding:20px 0;text-align:center"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:478px;" ><![endif]--> <div class="mj-column-per-100 mj-outlook-group-fix" style="direction:ltr;display:inline-block;font-size:0;text-align:left;vertical-align:top;width:100%"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%"> <tbody> <tr> <td align="center" style="font-size:0;padding:10px 25px 8px;word-break:break-word"> <div style="color:#002778;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;line-height:125%;text-align:center">¡Estás a punto de tener más fuerza para explorar!</div> </td> </tr> <tr> <td align="center" style="font-size:0;padding:10px 25px 16px;word-break:break-word"> <div style="color:#000;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:125%;text-align:center">Tu código de autenticación para la app Friso:</div> </td> </tr> <tr> <td align="center" style="font-size:0;padding:10px 25px;word-break:break-word"> <div style="color:#002778;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;letter-spacing:4px;line-height:125%;text-align:center;text-transform:uppercase">${body.code}</div> </td> </tr> <tr> <td align="center" style="font-size:0;padding:30px 25px 0;word-break:break-word"> <div style="color:#737373;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:125%;text-align:center">Si no hiciste este pedido, ignora este mensaje e informa al técnico responsable.</div> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]></td></tr></table><![endif]--> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:480px;" width="480" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--> <div style="margin:0 auto;max-width:480px"> <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%"> <tbody> <tr> <td style="direction:ltr;font-size:0;padding:20px 0;text-align:center"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr></tr></table><![endif]--> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]></td></tr></table><![endif]--> </div> </body></html>`
}