export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super("User not found", 404);
  }
}

export class UserExistsError extends AppError {
  constructor() {
    super("User already exists", 409);
  }
}

export class InvalidPasswordError extends AppError {
  constructor() {
    super("Password Invalid", 409);
  }
}

export class DeviceRegisteredError extends AppError {
  constructor() {
    super("Device is already registered", 409);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Invalid password", 401);
  }
}

export class DeviceNotRegisteredError extends AppError {
  constructor() {
    super("Device is not registered", 404);
  }
}

export class TemperatureRecordsNotAvailable extends AppError {
  constructor() {
    super("Temperature Records not available", 404);
  }
}

export class InvalidParameterError extends AppError {
  constructor() {
    super("Invalid parameter", 404);
  }
}

export class InvalidTokenOrExpired extends AppError {
  constructor() {
    super("Invalid token or expired token", 403);
  }
}

export class EmailSendError extends AppError {
  constructor() {
    super("Email not able to sent", 408);
  }
}

export class ReportGenerateError extends AppError {
  constructor() {
    super("temperature report not able generate ", 408);
  }
}
export class FileNotFound extends AppError {
  constructor() {
    super("File not found", 404);
  }
}
export class InvalidDate extends AppError {
  constructor() {
    super("Invalid date", 403);
  }
}
export class TemperatureNotFound extends AppError {
  constructor() {
    super("No temperature found", 403);
  }
}
export class FieldsNotFound extends AppError {
  constructor(message = "Invalid fields", statusCode = 403) {
    super(message, statusCode); // Default message and status code
  }
}
