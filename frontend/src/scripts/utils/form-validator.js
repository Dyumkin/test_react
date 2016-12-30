import rule from './rule';

export default class FormValidator {

  constructor() {
    this.errors = {};
    this.rules = {};
  }

  static init(rules) {
    let formValidator = new FormValidator();

    return formValidator.setRules(rules);
  }

  setRules(rules) {
    this.rules = rules;

    return this;
  }

  addRule(field, rule) {
    this.rules[field] = rule;

    return this;
  }

  setErrors(errors = {}) {
    this.errors = errors;

    return this;
  }

  addError(field, message) {
    this.errors = {
      ...this.errors,
      [field]: message
    };
  }

  removeError(field) {
    delete this.errors[field];
  }

  getErrors() {
    return this.errors;
  }

  getError(field) {
    const errors = this.errors[field];

    if (errors !== undefined) {
      const error = Array.isArray(errors) ? errors[0] : errors;

      if (typeof error === 'string') {
        return {
          style: 'danger',
          message: error
        };
      } else {
        let formValidator = new FormValidator();

        return formValidator.setErrors(error);
      }
    }

    return this;
  }

  clearErrors(clearErrorsAction) {
    if (this.hasErrors() && clearErrorsAction) {
      clearErrorsAction();
    }

    this.setErrors();
  }

  hasErrors() {
    return Object.keys(this.errors).length > 0;
  }

  validateAttribute(field, form) {
    const { rules } = this;
    let isValid = true;

    if (rules.hasOwnProperty(field)) {
      const { scenario } = rules[field];
      scenario.forEach(rule => {
        const { error, message } = rule(field, form);
        if (error) {
          this.addError(field, [ message ]);
          isValid = false;
        }
      });
    }

    return isValid;
  }

  validate(form) {
    let isValid = true;

    for (const field in form) {
      const isValidAttribute = this.validateAttribute(field, form);

      if(!isValidAttribute) {
        isValid = false
      }
    }

    return isValid;
  }

  static createRule() {
    return new rule();
  }
}
