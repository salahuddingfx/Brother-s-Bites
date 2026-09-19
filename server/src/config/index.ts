import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  serverUrl: process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`,
  mongodbUri: process.env.MONGODB_URI || '',
  authSecret: process.env.AUTH_SECRET || 'fallback-secret-change-this',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  brevo: {
    apiKey: process.env.BREVO_API_KEY || '',
    smtpHost: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    smtpPort: parseInt(process.env.BREVO_SMTP_PORT || '587', 10),
    smtpUser: process.env.BREVO_SMTP_USER || '',
    smtpKey: process.env.BREVO_SMTP_KEY || '',
    senderEmail: process.env.BREVO_SENDER_EMAIL || 'contact.brothersbites@gmail.com',
    senderName: process.env.BREVO_SENDER_NAME || "Brother's Bites",
  },
};
