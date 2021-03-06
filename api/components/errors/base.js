/**
 * Base error
 */
class BaseError extends Error {

  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
    this.status = 500;
    
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

export default BaseError;
