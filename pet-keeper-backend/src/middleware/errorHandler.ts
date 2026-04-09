import { Router, Response } from 'express';

export const errorHandler = (
  err: any,
  req: any,
  res: Response,
  next: any
) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFoundHandler = (req: any, res: Response, next: any) => {
  res.status(404).json({ error: 'Not found' });
};