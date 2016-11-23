import BaseError from  './base';

/**
 * Forbidden
 */
class Forbidden extends BaseError {
  constructor(message) {
    super(message);

    this.message = message || 'Forbidden';
    this.status = 403;
  }
}

export default Forbidden;
