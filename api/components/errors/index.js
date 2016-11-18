'use strict';

let ValidationError = require('./validation'),
  NotFound = require('./not-found'),
  Forbidden = require('./forbidden');

module.exports = {
  ValidationError,
  NotFound,
  Forbidden
};
