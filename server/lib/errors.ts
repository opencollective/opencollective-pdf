export class PDFServiceError extends Error {
  status: number;
  isPDFServiceError: true;

  constructor(message: string, status = 400, name: string = '') {
    super(message);
    this.name = name || this.constructor.name.replace(/Error$/, '');
    this.status = status;
    this.isPDFServiceError = true;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      isPDFServiceError: this.isPDFServiceError,
    };
  }
}

export class NotFoundError extends PDFServiceError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends PDFServiceError {
  constructor(message = 'You are not authorized to access this resource') {
    super(message, 401);
  }
}

export class ForbiddenError extends PDFServiceError {
  constructor(message = 'You are not allowed to access this resource') {
    super(message, 403);
  }
}

export class BadRequestError extends PDFServiceError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

export class InternalServerError extends PDFServiceError {
  constructor(message = 'Internal server error') {
    super(message, 500, 'InternalServerError');
  }
}
