import { Request, Response } from 'express';
import Contact from '../models/Contact';
import {
  sendEmail,
  getCustomerContactConfirmationHtml,
  getAdminContactAlertHtml,
} from '../utils/emailService';

/**
 * @desc    Submit customer contact message
 * @route   POST /api/v1/contact
 * @access  Public
 */
export const submitContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, subject, and message.',
      });
    }

    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';

    // Save to Database
    const newContact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
      ipAddress,
    });

    const formattedDate = new Date().toLocaleString('en-BD', {
      timeZone: 'Asia/Dhaka',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // 1. Send confirmation email to Customer
    const customerHtml = getCustomerContactConfirmationHtml(name.trim(), subject.trim(), message.trim());
    sendEmail({
      to: email.trim().toLowerCase(),
      subject: `We received your message — Brother's Bites`,
      html: customerHtml,
    }).catch((err) => console.error('Failed to send customer confirmation email:', err));

    // 2. Send notification email to Admin
    const adminEmail = process.env.ADMIN_ALERT_EMAIL || process.env.EMAIL_USER || 'admin@brothersbites.com';
    const adminHtml = getAdminContactAlertHtml(
      name.trim(),
      email.trim().toLowerCase(),
      phone ? phone.trim() : '',
      subject.trim(),
      message.trim(),
      formattedDate
    );

    sendEmail({
      to: adminEmail,
      subject: `🚨 New Website Message from ${name.trim()} regarding "${subject.trim()}"`,
      html: adminHtml,
    }).catch((err) => console.error('Failed to send admin alert email:', err));

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been sent successfully. We will get back to you shortly.',
      data: {
        id: newContact._id,
        createdAt: newContact.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Contact submission error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while submitting message. Please try again or WhatsApp us directly.',
    });
  }
};

/**
 * @desc    Get all contact messages (Admin)
 * @route   GET /api/v1/contact
 * @access  Private/Admin
 */
export const getAllContactMessages = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const total = await Contact.countDocuments(filter);
    const messages = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      success: true,
      data: {
        messages,
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
