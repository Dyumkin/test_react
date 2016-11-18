'use strict';

let ValidationError = require('../components/errors/validation');

module.exports = (error, req, res, next) => {
  let needJSONResponse = !req.headers['accept'] || req.headers['accept'] === 'application/json',
    data;

  error.status = error.status || 500;
  data = {
    success: false,
    error: error.message
  };

  if (error instanceof ValidationError) {
    data.error = error.getValidationErrors();
  }

  console.log(`Error appeared: ${error.status} ${error.message} ${error.stack}`);

  res.status(error.status);

  if (needJSONResponse) {
    res.json(data);
  } else {
    res.render('error', {
      message: error.message,
      error: error
    });
  }
};
