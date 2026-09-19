import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: any = null,
  statusCode: number = 200,
  message?: string
): void => {
  const response: any = { success: true };
  if (message) response.message = message;
  if (data !== null) response.data = data;
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500
): void => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
