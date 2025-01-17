class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class UserNotFoundError extends AppError {
  constructor() {
    super("User not found", 404); // HTTP 409 Not FOund
  }
}

class UserExistsError extends AppError {
  constructor() {
    super("User already exists", 409); // HTTP 409 Conflict
  }
}

class InvalidPasswordError extends AppError {
  constructor() {
    super("Password Invalid", 409); // HTTP 409 Conflict
  }
}

class DeviceRegisteredError extends AppError {
  constructor() {
    super("Device is already registered", 409); // HTTP 409 Conflict
  }
}

class InvalidCredentialsError extends AppError {
  constructor() {
    super("Invalid password", 401); // HTTP 401 Unauthorized
  }
}

class DeviceNotRegisteredError extends AppError {
  constructor() {
    super("Device is not registered", 404); // HTTP 404 FOund
  }
}

class TemperatureRecordsNotAvailable extends AppError {
  constructor() {
    super("Temperature Records not available", 404); // HTTP 404 FOund
  }
}

class InvalidParameterError extends AppError {
  constructor() {
    super("Invalid parameter", 404); // HTTP 404 FOund
  }
}

class InvalidTokenOrExpired extends AppError {
  constructor() {
    super("Invalid token or expired token", 404); // HTTP 404 FOund
  }
}

class EmailSendError extends AppError {
  constructor() {
    super("Email not able to sent", 408); // HTTP 404 FOund
  }
}

class ReportGenerateError extends AppError {
  constructor() {
    super("temperature report not able generate ", 408); // HTTP 404 FOund
  }
}
class FileNotFound extends AppError {
  constructor() {
    super("File not found", 404); // HTTP 404 FOund
  }
}

export {
  AppError,
  UserNotFoundError,
  UserExistsError,
  DeviceRegisteredError,
  InvalidCredentialsError,
  DeviceNotRegisteredError,
  InvalidPasswordError,
  TemperatureRecordsNotAvailable,
  InvalidParameterError,
  EmailSendError,
  InvalidTokenOrExpired,
  ReportGenerateError,
  FileNotFound,
};
