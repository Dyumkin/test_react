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
        let errors = {};

        Object.keys(this.errors).forEach((error) => {
            errors[error] = this.errors[error]['message'];
        });

        return errors;
    }
}

export default ValidationError;
