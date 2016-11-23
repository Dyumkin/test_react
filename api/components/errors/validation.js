import BaseError from  './base';

/**
 * Validation error
 */
class ValidationError extends BaseError {

  constructor(errors, message) {
    super(message || 'Validation error');

    this.errors = errors;
    this.status = 400;
  }

  getValidationErrors() {
    return this.errors;
  }
}

export default ValidationError;
