'use strict';

let BaseError = require('./base');

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

module.exports = ValidationError;
