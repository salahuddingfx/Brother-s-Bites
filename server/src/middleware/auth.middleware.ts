import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { config } from '../config';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const cookies = req.cookies as Record<string, string | undefined>;
    if (cookies?.token) {
      token = cookies.token;
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, please login',
      });
      return;
    }

    const decoded = jwt.verify(token, config.authSecret) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User not found or account deactivated',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid',
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, please login',
      });
      return;
    }

    // Super Admin has master access to all authorized endpoints
    if (req.user.role === 'super_admin') {
      next();
      return;
    }

    // If 'admin' is in allowed roles, allow 'manager' as well for operational routes unless super_admin exclusive
    const effectiveRoles = [...roles];
    if (roles.includes('admin') && !roles.includes('manager')) {
      effectiveRoles.push('manager');
    }

    if (!effectiveRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Not authorized, insufficient permissions',
      });
      return;
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const cookies = req.cookies as Record<string, string | undefined>;
    if (cookies?.token) {
      token = cookies.token;
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, config.authSecret) as { id: string };
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch {
    // Silently continue without user
  }
  next();
};
