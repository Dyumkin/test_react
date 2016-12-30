import FormValidator from './../form-validator';

export default class Rule {

    constructor() {
        this.scenario = [];
    }

    email() {
        this.scenario.push((field, form) => {
            const value = form[field];
            const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            return !pattern.test(value) ?
            { error: true, message: this._getLabel(field) + ' must be an email.' } :
            { error: false };
        });

        return this;
    }

    bool() {
        this.scenario.push((field, form) => {
            const value = form[field];

            return typeof value !== 'boolean' ?
            { error: true, message: this._getLabel(field) + ' must be a boolean.' } :
            { error: false };
        });

        return this;
    }

    string() {
        this.scenario.push((field, form) => {
            const value = form[field];

            return typeof value !== 'string' ?
            { error: true, message: this._getLabel(field) + ' must be a string.'} :
            { error: false };
        });

        return this;
    }

    number() {
        this.scenario.push((field, form) => {
            const value = Number(form[field]);

            return (value !== 'NaN') && (value > 0) ?
            { error: false } :
            { error: true, message: this._getLabel(field) + ' must be a number.' };
        });

        return this;
    }

    equal(cmpField) {
        this.scenario.push((field, form) => {
            const value = form[field];
            const cmpValue = form[cmpField];

            return value !== cmpValue ?
            { error: true, message: this._getLabel(field) + ' must be equal to ' + this._getLabel(cmpField) + ' field.' } :
            { error: false };
        });

        return this;
    }

    min(min) {
        this.scenario.push((field, form) => {
            const value = form[field];

            return (typeof value === 'number' && value < min) || (value !== '' && typeof value === 'string' && value.length < min) ?
            { error: true, message: this._getLabel(field) + ' must be greater than ' + min + ' symbol(s).' } :
            { error: false };
        });

        return this;
    }

    max(max) {
        this.scenario.push((field, form) => {
            const value = form[field];

            return (typeof value === 'number' && value > max) || (typeof value === 'string' && value.length > max) ?
            { error: true, message: this._getLabel(field) + ' must be less than ' + max + ' symbol(s).' } :
            { error: false };
        });

        return this;
    }

    enum(list) {
        this.scenario.push((field, form) => {
            const value = form[field];

            return list.indexOf(value) === -1 ?
            { error: true, message: this._getLabel(field) + ' must be enum in ' + list.join(', ') + '.' } :
            { error: false };
        });

        return this;
    }

    isRequired() {
        this.scenario.push((field, form) => {
            const value = form[field];

            return value === null || value === undefined ||
            (typeof value === 'string' && value === '') ||
            (typeof value === 'object' && Object.keys(value).length === 0) ?
            { error: true, message: this._getLabel(field) + ' can\'t be blank.' } :
            { error: false };
        });

        return this;
    }

    cascade(rules) {
        this.scenario.push((field, form) => {
            const values = form[field];

            let hasErrors = false;
            let messages = {};

            values.forEach((value, index) => {
                let formValidator = FormValidator.init(rules);
                const isValid = formValidator.validate(value);

                if (!isValid) {
                    messages[index] = formValidator.getErrors();
                    hasErrors = true;
                }
            });

            return hasErrors ? {error: true, message: messages} : {error: false};
        });

        return this;
    }

    _getLabel(field) {
        return field.replace(/([A-Z])?_([a-z])?/g, ' $1$2').replace(/(\s|^)./g, str => str.toUpperCase());
    }

}
