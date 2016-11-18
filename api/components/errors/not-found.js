'use strict';

let BaseError = require('./base');

/**
 * Not found error
 */
class NotFound extends BaseError {
  constructor(message) {
    super(message);

    this.message = message || 'Not found';
    this.status = 404;
  }
}

module.exports = NotFound;
