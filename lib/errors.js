import { get } from 'lodash';

class CustomError extends Error {
  constructor(message, status = 400, name = undefined) {
    super(message);
    this.name = name || this.constructor.name.replace(/Error$/, '');
    this.status = status;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
    };
  }
}

export class NotFoundError extends CustomError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = 'You are not authorized to access this resource') {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = 'You are not allowed to access this resource') {
    super(message, 403);
  }
}

export class BadRequestError extends CustomError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

export class InternalServerError extends CustomError {
  constructor(message = 'Internal server error') {
    super(message, 500, 'InternalServerError');
  }
}

export const adaptApolloError = (error) => {
  const status = get(error, 'networkError.statusCode') || get(error, 'graphQLErrors[0].extensions.code');
  const message = get(error, 'networkError.result.error.message') || get(error, 'graphQLErrors[0].message');
  switch (status) {
    case 400:
    case 'BadRequest':
      return new BadRequestError(message);
    case 401:
      return new UnauthorizedError(message);
    case 403:
      return new ForbiddenError(message);
    case 404:
      return new NotFoundError(message);
    case 500:
      return new InternalServerError(message);
    default:
      return new InternalServerError(message);
  }
};
