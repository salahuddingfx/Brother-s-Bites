import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { config } from '../config';

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof ZodError) {
    statusCode = 400;
    const errors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    message = `Validation error: ${errors.join(', ')}`;
  }

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = `Validation error: ${messages.join(', ')}`;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token, please login again';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired, please login again';
  }

  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  if (config.nodeEnv === 'development') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};
