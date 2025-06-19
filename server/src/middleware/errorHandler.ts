import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
}

export const errorHandler = (
  error: ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', error);

  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  if (error.name === 'ValidationError') {
    res.status(400).json({
      message: 'Validation Error',
      errors: error.message,
    });
    return;
  }

  if (error.name === 'CastError') {
    res.status(400).json({
      message: 'Invalid ID format',
    });
    return;
  }

  if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    res.status(400).json({
      message: 'Duplicate field value',
    });
    return;
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as ErrorWithStatus;
  error.status = 404;
  next(error);
};