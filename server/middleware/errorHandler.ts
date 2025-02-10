import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { trace } from '@opentelemetry/api';

// Define our custom error type
export interface ServerError extends Error {
  status?: number;
  code?: string;
  log?: string;
}

// Middleware to log errors and add them to traces
export const errorLogger: ErrorRequestHandler = (
  err: ServerError,
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // Get the current span from OpenTelemetry
  const span = trace.getActiveSpan();
  
  if (span) {
    // Add error details to the span
    span.setAttributes({
      'error.type': err.name,
      'error.message': err.message,
      'error.stack': err.stack || '',
      'error.code': err.code || 'UNKNOWN',
      'http.method': req.method,
      'http.url': req.url,
    });
    span.setStatus({ code: 2 }); // ERROR
  }
  
  // Log the error for server-side debugging
  console.error(`[${new Date().toISOString()}] Error:`, {
    method: req.method,
    url: req.url,
    error: err.message,
    stack: err.stack,
  });
  
  next(err);
};

// Main error handler middleware
export const errorHandler: ErrorRequestHandler = (
  err: ServerError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Default error response
  const defaultError = {
    message: 'An unexpected error occurred',
    status: 500,
    code: 'INTERNAL_SERVER_ERROR',
  };

  // Determine appropriate error response
  const errorResponse = {
    message: err.message || defaultError.message,
    status: err.status || defaultError.status,
    code: err.code || defaultError.code,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  // Send error response
  res.status(errorResponse.status).json({
    error: errorResponse,
    timestamp: new Date().toISOString(),
  });
};

// Custom error classes for specific scenarios
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
    this.code = 'VALIDATION_ERROR';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
    this.status = 401;
    this.code = 'AUTHENTICATION_ERROR';
  }
}