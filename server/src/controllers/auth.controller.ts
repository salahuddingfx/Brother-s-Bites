import { Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { config } from '../config';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';
import { sendSuccess, sendError } from '../utils/apiResponse';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, config.authSecret, { expiresIn: '7d' });
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, phone, password, address } = validatedData;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      sendError(res, 'An account with this email already exists.', 400);
      return;
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      role: 'customer',
      address: address || {
        street: '',
        city: "Cox's Bazar",
        area: '',
        landmark: '',
      },
      isActive: true,
    });

    const token = generateToken(user._id.toString());

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(
      res,
      {
        token,
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
      201,
      'Registration successful'
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      sendError(res, 'Validation error. Please check your fields.', 400);
      return;
    }
    console.error('Error in register:', error);
    sendError(res, 'Server error during registration', 500);
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const identifier = (validatedData.identifier || validatedData.email || '').trim();
    const { password } = validatedData;

    // Search user by email (case-insensitive) OR username (case-insensitive) OR name (exact/case-insensitive)
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() },
        { name: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      ],
    }).select('+password');

    if (!user) {
      sendError(res, 'Invalid credentials. User not found.', 401);
      return;
    }

    if (!user.isActive) {
      sendError(res, 'Account is inactive. Please contact Super Admin.', 403);
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, 'Invalid password. Please try again.', 401);
      return;
    }

    const token = generateToken(user._id.toString());

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(
      res,
      {
        token,
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
      200,
      'Login successful'
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      sendError(res, 'Invalid login credentials format', 400);
      return;
    }
    sendError(res, 'Server error during login', 500);
  }
};

export const logout = async (_req: AuthRequest, res: Response): Promise<void> => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  sendSuccess(res, null, 200, 'Logged out successfully');
};

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }
    sendSuccess(res, {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      isActive: user.isActive,
    });
  } catch {
    sendError(res, 'Server error', 500);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { name, username, email, phone, address } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    if (email && email.toLowerCase() !== user.email) {
      const existing = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });
      if (existing) {
        sendError(res, 'Email is already in use by another account', 400);
        return;
      }
      user.email = email.toLowerCase().trim();
    }

    if (username !== undefined && username.trim()) {
      const trimmedUser = username.toLowerCase().trim();
      if (trimmedUser !== user.username) {
        const existingU = await User.findOne({
          username: trimmedUser,
          _id: { $ne: userId },
        });
        if (existingU) {
          sendError(res, 'Username is already taken', 400);
          return;
        }
        user.username = trimmedUser;
      }
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (address && typeof address === 'object') {
      user.address = {
        street: address.street?.trim() ?? user.address?.street ?? '',
        city: address.city?.trim() ?? user.address?.city ?? "Cox's Bazar",
        area: address.area?.trim() ?? user.address?.area ?? '',
        landmark: address.landmark?.trim() ?? user.address?.landmark ?? '',
      };
    }

    await user.save();

    sendSuccess(
      res,
      {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
      200,
      'Profile updated successfully'
    );
  } catch (error) {
    console.error('Error in updateProfile:', error);
    sendError(res, 'Server error updating profile', 500);
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const userId = req.user?._id;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      sendError(res, 'Current password is incorrect', 400);
      return;
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, null, 200, 'Password updated successfully');
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      sendError(res, 'Validation error. New password must be at least 6 characters.', 400);
      return;
    }
    sendError(res, 'Server error updating password', 500);
  }
};

export const forgotPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Do not leak whether user exists for security, but return generic success message
      sendSuccess(
        res,
        null,
        200,
        'If an account exists with that email, reset instructions have been generated.'
      );
      return;
    }

    // Generate unhashed reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token to store in DB
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
    await user.save();

    // Log the reset link for development / server logs
    const isAdminOrStaff = ['super_admin', 'admin', 'manager', 'staff'].includes(user.role);
    const resetPath = isAdminOrStaff ? '/admin/reset-password' : '/reset-password';
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}${resetPath}?token=${resetToken}`;
    console.log(`\n========================================`);
    console.log(`[PASSWORD RESET REQUEST] for ${user.email} (${user.role})`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token: ${resetToken}`);
    console.log(`========================================\n`);

    sendSuccess(
      res,
      {
        resetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
        resetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
      },
      200,
      'Password reset instructions generated successfully. Token valid for 15 minutes.'
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      sendError(res, 'Please provide a valid email address', 400);
      return;
    }
    sendError(res, 'Server error processing forgot password', 500);
  }
};

export const resetPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      sendError(res, 'Invalid or expired password reset token', 400);
      return;
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    sendSuccess(res, null, 200, 'Password has been successfully reset. You can now login.');
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      sendError(res, 'Password must be at least 6 characters', 400);
      return;
    }
    sendError(res, 'Server error resetting password', 500);
  }
};
