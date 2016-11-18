var express = require('express'),
  router = express.Router();

// Routes
router.use('/start', require('./actions/start'));

module.exports = router;
