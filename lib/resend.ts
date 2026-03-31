import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not set')
}

export const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'hello@emmafrey.com'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function sendDownloadEmail({
  to,
  name,
  productName,
  downloadToken,
}: {
  to: string
  name?: string | null
  productName: string
  downloadToken: string
}) {
  const downloadUrl = `${SITE_URL}/api/download/${downloadToken}`
  const greeting = name ? `Hi ${name},` : 'Hi there,'

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Your download is ready: ${productName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: 'DM Sans', Arial, sans-serif; background: #FDF7F2; margin: 0; padding: 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 16px rgba(45,32,37,0.1);">
            <div style="background: linear-gradient(135deg, #F5E6D3 0%, #F0D9E0 100%); padding: 40px 40px 32px; text-align: center;">
              <h1 style="font-family: 'Playfair Display', Georgia, serif; color: #2D2025; font-size: 28px; margin: 0 0 8px;">
                Your download is ready! 🎉
              </h1>
              <p style="color: #7A6268; margin: 0; font-size: 16px;">${productName}</p>
            </div>
            <div style="padding: 40px;">
              <p style="color: #3A2A30; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">${greeting}</p>
              <p style="color: #3A2A30; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
                Thank you for your order! Your download is ready and waiting for you.
                Click the button below to access your file. This link is valid for 7 days.
              </p>
              <div style="text-align: center; margin: 0 0 32px;">
                <a href="${downloadUrl}"
                   style="display: inline-block; background: #C9748F; color: white; text-decoration: none;
                          padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: 600;
                          box-shadow: 0 4px 16px rgba(201,116,143,0.4);">
                  Download Now →
                </a>
              </div>
              <p style="color: #7A6268; font-size: 14px; line-height: 1.6; margin: 0 0 8px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #C9748F; font-size: 13px; word-break: break-all; margin: 0 0 32px;">
                ${downloadUrl}
              </p>
              <hr style="border: none; border-top: 1px solid #EDD9CB; margin: 0 0 24px;">
              <p style="color: #7A6268; font-size: 14px; line-height: 1.6; margin: 0; text-align: center;">
                With love, <strong style="color: #C9748F;">Emma Frey</strong> 💕<br>
                <a href="${SITE_URL}" style="color: #8B6B8A; text-decoration: none;">emmafrey.com</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string
  name?: string | null
}) {
  const greeting = name ? `Hi ${name}!` : 'Hi there!'

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Welcome to the community! Here's what's next 💕",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: Arial, sans-serif; background: #FDF7F2; margin: 0; padding: 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 16px rgba(45,32,37,0.1);">
            <div style="background: linear-gradient(135deg, #F5E6D3 0%, #F0D9E0 100%); padding: 40px 40px 32px; text-align: center;">
              <h1 style="font-family: Georgia, serif; color: #2D2025; font-size: 28px; margin: 0 0 8px;">
                Welcome! You're in. 🎉
              </h1>
            </div>
            <div style="padding: 40px;">
              <p style="color: #3A2A30; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">${greeting}</p>
              <p style="color: #3A2A30; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
                I'm so excited you're here. You've just joined a community of women who are done playing small and ready to build real income online.
              </p>
              <p style="color: #3A2A30; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
                Stay tuned — I'll be sharing my best tips, strategies, and resources with you soon!
              </p>
              <div style="text-align: center;">
                <a href="${SITE_URL}"
                   style="display: inline-block; background: #C9748F; color: white; text-decoration: none;
                          padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: 600;">
                  Visit the Storefront →
                </a>
              </div>
              <hr style="border: none; border-top: 1px solid #EDD9CB; margin: 32px 0 24px;">
              <p style="color: #7A6268; font-size: 14px; text-align: center; margin: 0;">
                With love, <strong style="color: #C9748F;">Emma Frey</strong> 💕
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}
