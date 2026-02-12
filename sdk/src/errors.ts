export class EnvDevError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvDevError';
  }
}

export class AuthError extends EnvDevError {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthError';
  }
}

export class NotFoundError extends EnvDevError {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends EnvDevError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ServerError extends EnvDevError {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = statusCode;
  }
}

export class NetworkError extends EnvDevError {
  constructor(message: string = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}
