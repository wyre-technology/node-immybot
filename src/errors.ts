/**
 * Base error class for all ImmyBot service errors
 */
export class ServiceError extends Error {
  constructor(message: string, public statusCode: number, public response: unknown) {
    super(message);
    this.name = 'ServiceError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Authentication failed - invalid or expired credentials
 */
export class AuthenticationError extends ServiceError {
  constructor(message: string, response: unknown) {
    super(message, 401, response);
    this.name = 'AuthenticationError';
  }
}

/**
 * Access forbidden - valid credentials but insufficient permissions
 */
export class ForbiddenError extends ServiceError {
  constructor(message: string, response: unknown) {
    super(message, 403, response);
    this.name = 'ForbiddenError';
  }
}

/**
 * Resource not found
 */
export class NotFoundError extends ServiceError {
  constructor(message: string, response: unknown) {
    super(message, 404, response);
    this.name = 'NotFoundError';
  }
}

/**
 * Request validation failed
 */
export class ValidationError extends ServiceError {
  constructor(
    message: string,
    public errors: Array<{field: string; message: string}>,
    response: unknown
  ) {
    super(message, 400, response);
    this.name = 'ValidationError';
  }
}

/**
 * Rate limit exceeded
 */
export class RateLimitError extends ServiceError {
  constructor(message: string, public retryAfter: number, response: unknown) {
    super(message, 429, response);
    this.name = 'RateLimitError';
  }
}

/**
 * Internal server error
 */
export class ServerError extends ServiceError {
  constructor(message: string, response: unknown) {
    super(message, 500, response);
    this.name = 'ServerError';
  }
}