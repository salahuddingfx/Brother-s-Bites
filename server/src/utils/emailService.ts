import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create reusable transporter if SMTP config is available
const createTransporter = () => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT) || 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return null;
};

export const sendEmail = async (options: SendEmailOptions): Promise<boolean> => {
  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || '"Brother\'s Bites" <noreply@brothersbites.com>';

  if (!transporter) {
    console.log(`📧 [EMAIL SIMULATION] To: ${options.to} | Subject: ${options.subject}`);
    return true;
  }

  try {
    await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]*>?/gm, ''),
      html: options.html,
    });
    console.log(`✅ [EMAIL SENT] To: ${options.to} | Subject: ${options.subject}`);
    return true;
  } catch (error) {
    console.error(`❌ [EMAIL ERROR] Failed to send email to ${options.to}:`, error);
    return false;
  }
};

/**
 * Generates branded HTML confirmation email for customer
 */
export const getCustomerContactConfirmationHtml = (name: string, subject: string, message: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>We Received Your Message — Brother's Bites</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #0a0a0c; color: #fdfaf6; margin: 0; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #16161a; border: 1px solid #fbbf24; border-radius: 16px; overflow: hidden; padding: 32px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #2a2a30;">
        <h1 style="color: #fbbf24; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Brother's Bites</h1>
        <p style="color: #fdfaf6; opacity: 0.7; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">Bites • Sips • Brotherhood</p>
      </div>

      <div style="padding: 24px 0;">
        <h2 style="color: #fdfaf6; font-size: 18px; margin-top: 0;">Hi ${name},</h2>
        <p style="color: #fdfaf6; opacity: 0.85; line-height: 1.6; font-size: 14px;">
          Thank you for reaching out to <strong>Brother's Bites</strong>. We have received your inquiry regarding <strong>"${subject}"</strong>.
        </p>
        <p style="color: #fdfaf6; opacity: 0.85; line-height: 1.6; font-size: 14px;">
          Our kitchen and management team at Marine Drive, Sonar Para Beach, Cox's Bazar will review your message and get back to you shortly.
        </p>

        <div style="background-color: #0a0a0c; border: 1px solid #2a2a30; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="color: #fbbf24; font-size: 12px; font-weight: bold; margin: 0 0 8px 0; text-transform: uppercase;">Your Message Summary:</p>
          <p style="color: #fdfaf6; opacity: 0.8; font-size: 13px; font-style: italic; margin: 0; white-space: pre-wrap;">"${message}"</p>
        </div>

        <p style="color: #fdfaf6; opacity: 0.85; font-size: 13px;">
          For urgent food preorders, group reservations, or beach directions, feel free to call or WhatsApp our direct hotline at <strong style="color: #fbbf24;">+880 1627-817436</strong>.
        </p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #2a2a30; font-size: 11px; color: #fdfaf6; opacity: 0.5;">
        <p style="margin: 0;">Marine Drive, Sonar Para Beach, Cox's Bazar, Bangladesh</p>
        <p style="margin: 4px 0 0 0;">© ${new Date().getFullYear()} Brother's Bites. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

/**
 * Generates admin notification email
 */
export const getAdminContactAlertHtml = (
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string,
  date: string
) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>🚨 New Customer Inquiry — Brother's Bites</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f5; color: #18181b; margin: 0; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background-color: #fbbf24; padding: 16px 24px; border-radius: 12px; margin-bottom: 24px;">
        <h2 style="margin: 0; color: #0a0a0c; font-size: 18px; font-weight: 800; text-transform: uppercase;">
          New Website Contact Message
        </h2>
        <p style="margin: 4px 0 0 0; color: #0a0a0c; opacity: 0.8; font-size: 12px;">Received on ${date}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #71717a; width: 100px; font-weight: bold;">Customer:</td>
          <td style="padding: 8px 0; color: #18181b; font-weight: bold;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #71717a; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #71717a; font-weight: bold;">Phone:</td>
          <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #18181b; font-weight: bold;">${phone || 'Not provided'}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #71717a; font-weight: bold;">Subject:</td>
          <td style="padding: 8px 0; color: #d97706; font-weight: bold;">${subject}</td>
        </tr>
      </table>

      <div style="background-color: #f4f4f5; border-radius: 12px; padding: 16px; margin: 16px 0;">
        <p style="font-size: 12px; color: #71717a; font-weight: bold; margin: 0 0 6px 0; text-transform: uppercase;">Message Content:</p>
        <p style="color: #18181b; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e4e4e7; font-size: 12px; color: #71717a;">
        <p style="margin: 0;">To reply, simply click the customer's email or phone number above.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};
