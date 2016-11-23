import express from 'express';
import passport from 'passport';

const router = express.Router();

// pass passport for configuration
require('../config/passport')(passport);

// Routes
router.use('/start', require('./actions/start'));
router.use('/security', require('./actions/security'));

export default router;
