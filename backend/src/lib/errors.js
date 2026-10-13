export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const badRequest = (message) => new HttpError(400, message);
export const unauthorized = (message = 'Please log in first.') => new HttpError(401, message);
export const forbidden = (message = 'Admin access only.') => new HttpError(403, message);
export const notFound = (message = 'Not found.') => new HttpError(404, message);
export const conflict = (message) => new HttpError(409, message);

/** PostgreSQL unique_violation */
export const isUniqueViolation = (err) => err?.code === '23505';
