import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';
import { createUserSchema, updateUserSchema } from '../validators/auth.validator';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    sendSuccess(res, users, 200, 'Staff & Admin users fetched successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch users', 500);
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }
    sendSuccess(res, user, 200);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch user', 500);
  }
};

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = createUserSchema.parse(req.body);

    const email = validatedData.email.toLowerCase().trim();
    const username = validatedData.username?.trim()
      ? validatedData.username.trim().toLowerCase()
      : undefined;

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      sendError(res, 'A user with this email already exists', 400);
      return;
    }

    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        sendError(res, 'A user with this username already exists', 400);
        return;
      }
    }

    const newUser = await User.create({
      name: validatedData.name.trim(),
      email,
      username,
      password: validatedData.password,
      role: validatedData.role,
      phone: validatedData.phone?.trim() || undefined,
      isActive: validatedData.isActive ?? true,
    });

    const userObj = newUser.toObject();
    delete (userObj as any).password;

    sendSuccess(res, userObj, 201, 'Team member added successfully');
  } catch (error: any) {
    if (error && error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Invalid form input';
      sendError(res, firstMsg, 400);
      return;
    }
    if (error && error.code === 11000) {
      sendError(res, 'A user with this email or username already exists', 400);
      return;
    }
    sendError(res, error.message || 'Failed to create user', 500);
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updateUserSchema.parse(req.body);

    const user = await User.findById(id);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // If changing email, check for duplicate
    if (validatedData.email && validatedData.email.toLowerCase().trim() !== user.email) {
      const email = validatedData.email.toLowerCase().trim();
      const existing = await User.findOne({ email, _id: { $ne: id } });
      if (existing) {
        sendError(res, 'Email is already in use by another user', 400);
        return;
      }
      user.email = email;
    }

    if (validatedData.username !== undefined) {
      const username = validatedData.username.trim()
        ? validatedData.username.trim().toLowerCase()
        : undefined;
      if (username && username !== user.username) {
        const existing = await User.findOne({ username, _id: { $ne: id } });
        if (existing) {
          sendError(res, 'Username is already in use by another user', 400);
          return;
        }
        user.username = username;
      } else if (!username) {
        user.username = undefined;
      }
    }

    if (validatedData.name) user.name = validatedData.name.trim();
    if (validatedData.role) user.role = validatedData.role;
    if (validatedData.phone !== undefined) user.phone = validatedData.phone.trim() || undefined;
    if (validatedData.isActive !== undefined) user.isActive = validatedData.isActive;
    if (validatedData.password && validatedData.password.trim()) {
      user.password = validatedData.password.trim();
    }

    await user.save();

    const userObj = user.toObject();
    delete (userObj as any).password;

    sendSuccess(res, userObj, 200, 'User updated successfully');
  } catch (error: any) {
    if (error && error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Invalid form input';
      sendError(res, firstMsg, 400);
      return;
    }
    if (error && error.code === 11000) {
      sendError(res, 'A user with this email or username already exists', 400);
      return;
    }
    sendError(res, error.message || 'Failed to update user', 500);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?._id?.toString();

    if (currentUserId === id) {
      sendError(res, 'You cannot delete your own account', 400);
      return;
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, null, 200, 'User deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete user', 500);
  }
};
