import nodemailer from 'nodemailer';
import { config } from '../config';

const LOGO_URL = `${config.serverUrl}/public/images/logo.png`;
const LOGO_ICON_URL = `${config.serverUrl}/public/images/logo-icon.png`;

const transporter = nodemailer.createTransport({
  host: config.brevo.smtpHost,
  port: config.brevo.smtpPort,
  secure: false,
  auth: {
    user: config.brevo.smtpUser,
    pass: config.brevo.smtpKey,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions): Promise<boolean> => {
  try {
    if (!config.brevo.smtpKey) {
      console.warn('Brevo SMTP not configured, skipping email');
      return false;
    }
    await transporter.sendMail({
      from: `"${config.brevo.senderName}" <${config.brevo.senderEmail}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

export const generateOrderConfirmationEmail = (order: {
  orderNumber: string;
  customer: { name: string; phone: string; email?: string };
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  orderType: string;
  status: string;
}): string => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;">${item.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:right;">৳${item.price * item.quantity}</td>
      </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;">
        <div style="background:#000000;padding:24px;text-align:center;">
          <img src="${LOGO_URL}" alt="Brother's Bites" style="height:48px;width:auto;margin:0 auto 8px;display:block;" />
          <p style="color:#999;margin:4px 0 0;font-size:12px;">Order Confirmation</p>
        </div>
        <div style="padding:24px;">
          <h2 style="color:#333;margin:0 0 8px;">Hi ${order.customer.name}!</h2>
          <p style="color:#666;margin:0 0 20px;font-size:14px;">Your order <strong>#${order.orderNumber}</strong> has been received successfully.</p>
          
          <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:20px;">
            <p style="margin:0 0 8px;font-size:13px;color:#666;"><strong>Order Type:</strong> ${order.orderType === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}</p>
            <p style="margin:0;font-size:13px;color:#666;"><strong>Status:</strong> <span style="color:#e67e22;text-transform:capitalize;">${order.status}</span></p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <thead>
              <tr style="background:#000000;">
                <th style="padding:10px 12px;color:#FFD700;text-align:left;font-size:13px;">Item</th>
                <th style="padding:10px 12px;color:#FFD700;text-align:center;font-size:13px;">Qty</th>
                <th style="padding:10px 12px;color:#FFD700;text-align:right;font-size:13px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:12px;font-weight:bold;font-size:15px;border-top:2px solid #000;">Grand Total</td>
                <td style="padding:12px;text-align:right;font-weight:bold;font-size:15px;border-top:2px solid #000;color:#e67e22;">৳${order.totalAmount}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background:#fff3cd;border-radius:8px;padding:16px;margin-bottom:20px;border:1px solid #ffc107;">
            <p style="margin:0;font-size:13px;color:#856404;">💡 <strong>Payment:</strong> Cash on ${order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}. Please keep the exact amount ready.</p>
          </div>

          <p style="color:#999;font-size:12px;text-align:center;margin:20px 0 0;">
            Brother's Bites · Marine Drive, Sonar Para Beach, Cox's Bazar<br>
            Questions? Call us at +880 1627-817436
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateAdminOrderNotificationEmail = (order: {
  orderNumber: string;
  customer: { name: string; phone: string };
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  orderType: string;
}): string => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;">${item.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:right;">৳${item.price * item.quantity}</td>
      </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;">
        <div style="background:#000000;padding:24px;text-align:center;">
          <img src="${LOGO_URL}" alt="Brother's Bites" style="height:48px;width:auto;margin:0 auto 8px;display:block;" />
          <p style="color:#FFD700;margin:4px 0 0;font-size:14px;font-weight:bold;">🆕 New Order!</p>
          <p style="color:#999;margin:4px 0 0;font-size:12px;">#${order.orderNumber}</p>
        </div>
        <div style="padding:24px;">
          <h2 style="color:#333;margin:0 0 16px;">New order received</h2>
          
          <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin-bottom:20px;border:1px solid #bae6fd;">
            <p style="margin:0 0 8px;font-size:14px;"><strong>Customer:</strong> ${order.customer.name}</p>
            <p style="margin:0 0 8px;font-size:14px;"><strong>Phone:</strong> ${order.customer.phone}</p>
            <p style="margin:0;font-size:14px;"><strong>Type:</strong> ${order.orderType === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}</p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <thead>
              <tr style="background:#000000;">
                <th style="padding:10px 12px;color:#FFD700;text-align:left;font-size:13px;">Item</th>
                <th style="padding:10px 12px;color:#FFD700;text-align:center;font-size:13px;">Qty</th>
                <th style="padding:10px 12px;color:#FFD700;text-align:right;font-size:13px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:12px;font-weight:bold;font-size:15px;border-top:2px solid #000;">Grand Total</td>
                <td style="padding:12px;text-align:right;font-weight:bold;font-size:15px;border-top:2px solid #000;color:#e67e22;">৳${order.totalAmount}</td>
              </tr>
            </tfoot>
          </table>

          <p style="color:#999;font-size:12px;text-align:center;margin:20px 0 0;">
            Login to admin panel to manage this order.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateOrderStatusUpdateEmail = (order: {
  orderNumber: string;
  customer: { name: string; phone?: string; email?: string; address?: { street?: string; city?: string; area?: string; landmark?: string } };
  status: string;
  orderType: string;
  items?: { name: string; quantity: number; price: number }[];
  totalAmount?: number;
  paymentMethod?: string;
  createdAt?: Date | string;
}): string => {
  const itemsHtml = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;font-weight:600;">${item.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e5e5;font-size:14px;color:#444;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e5e5;font-size:14px;color:#444;text-align:right;">৳${item.price}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;font-weight:700;text-align:right;">৳${item.price * item.quantity}</td>
      </tr>`
    )
    .join('');

  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString();
  const addressStr = order.customer.address
    ? [order.customer.address.street, order.customer.address.area, order.customer.address.city, order.customer.address.landmark ? `(Near: ${order.customer.address.landmark})` : ''].filter(Boolean).join(', ')
    : 'Sonar Para Beach Kitchen (Pickup)';

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#0d0d0d;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#ffffff;">
      <div style="max-width:600px;margin:20px auto;background:#141414;border:1px solid #262626;border-radius:12px;overflow:hidden;">
        
        <!-- Header -->
        <div style="background:#040404;padding:28px 24px;text-align:center;border-bottom:2px solid #FEBD0F;">
          <img src="${LOGO_URL}" alt="Brother's Bites" style="height:44px;width:auto;margin:0 auto 10px;display:block;" />
          <p style="color:#FEBD0F;margin:0;font-size:13px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;">
            Official Delivery Invoice & Receipt
          </p>
          <p style="color:#888888;margin:4px 0 0;font-size:11px;">
            Marine Drive, Sonar Para Beach, Cox's Bazar · +880 1627-817436
          </p>
        </div>

        <div style="padding:28px 24px;">
          <!-- Delivered Badge -->
          <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:8px;padding:16px;text-align:center;margin-bottom:24px;">
            <p style="margin:0;font-size:16px;font-weight:800;color:#4ade80;text-transform:uppercase;letter-spacing:0.05em;">
              ✓ Order Delivered Successfully!
            </p>
            <p style="margin:6px 0 0;font-size:13px;color:#cccccc;">
              Hi <strong>${order.customer.name}</strong>, your coastal meal from Brother's Bites has been delivered. Enjoy every bite!
            </p>
          </div>

          <!-- Invoice Meta Grid -->
          <table style="width:100%;margin-bottom:24px;border-collapse:collapse;font-size:13px;">
            <tr>
              <td style="padding:8px 12px;background:#1a1a1a;border-radius:6px;width:50%;vertical-align:top;">
                <p style="margin:0;color:#888;font-size:11px;text-transform:uppercase;font-weight:700;">Invoice #</p>
                <p style="margin:2px 0 0;color:#FEBD0F;font-size:14px;font-weight:800;">${order.orderNumber}</p>
                <p style="margin:6px 0 0;color:#888;font-size:11px;text-transform:uppercase;font-weight:700;">Date & Time</p>
                <p style="margin:2px 0 0;color:#ffffff;font-size:12px;">${dateStr}</p>
              </td>
              <td style="width:12px;"></td>
              <td style="padding:8px 12px;background:#1a1a1a;border-radius:6px;width:50%;vertical-align:top;">
                <p style="margin:0;color:#888;font-size:11px;text-transform:uppercase;font-weight:700;">Order Type</p>
                <p style="margin:2px 0 0;color:#ffffff;font-size:13px;font-weight:700;text-transform:capitalize;">${order.orderType}</p>
                <p style="margin:6px 0 0;color:#888;font-size:11px;text-transform:uppercase;font-weight:700;">Destination / Phone</p>
                <p style="margin:2px 0 0;color:#ffffff;font-size:12px;">${order.customer.phone || 'N/A'}</p>
              </td>
            </tr>
          </table>

          <!-- Items Table -->
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#ffffff;border-radius:8px;overflow:hidden;">
            <thead>
              <tr style="background:#040404;border-bottom:2px solid #FEBD0F;">
                <th style="padding:10px 12px;color:#FEBD0F;text-align:left;font-size:12px;text-transform:uppercase;">Item</th>
                <th style="padding:10px 12px;color:#FEBD0F;text-align:center;font-size:12px;text-transform:uppercase;">Qty</th>
                <th style="padding:10px 12px;color:#FEBD0F;text-align:right;font-size:12px;text-transform:uppercase;">Price</th>
                <th style="padding:10px 12px;color:#FEBD0F;text-align:right;font-size:12px;text-transform:uppercase;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml || `<tr><td colspan="4" style="padding:16px;text-align:center;color:#666;">Fresh Coastal Order</td></tr>`}
            </tbody>
            <tfoot>
              <tr style="background:#f9f9f9;">
                <td colspan="3" style="padding:12px;font-weight:800;font-size:14px;color:#000000;border-top:2px solid #040404;">Grand Total Paid</td>
                <td style="padding:12px;text-align:right;font-weight:900;font-size:16px;color:#000000;border-top:2px solid #040404;">৳${order.totalAmount || 0}</td>
              </tr>
            </tfoot>
          </table>

          <!-- Review CTA Box -->
          <div style="background:#1f1c14;border:1px solid #FEBD0F;border-radius:8px;padding:20px;text-align:center;margin-top:24px;">
            <p style="margin:0 0 6px;color:#FEBD0F;font-size:14px;font-weight:800;text-transform:uppercase;">
              How Was Your Food Today?
            </p>
            <p style="margin:0 0 16px;font-size:12px;color:#cccccc;line-height:1.4;">
              Your feedback means the world to us. Tap below to leave a quick rating & review!
            </p>
            <a href="${config.clientUrl}/track-order?order=${order.orderNumber}" style="display:inline-block;background:#FEBD0F;color:#040404;font-weight:800;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;padding:10px 24px;border-radius:6px;text-decoration:none;">
              ★ Leave a Quick Review
            </a>
          </div>

          <!-- Footer -->
          <p style="color:#666666;font-size:11px;text-align:center;margin:24px 0 0;">
            Brother's Bites · Bites • Sips • Brotherhood · Marine Drive, Sonar Para Beach, Cox's Bazar
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
