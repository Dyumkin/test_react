'use strict';

module.exports = {
  http: [
    require('./extendResponse'),
    require('./isAuthorized')
  ]
};

