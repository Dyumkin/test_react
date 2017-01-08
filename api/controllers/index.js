import express from 'express';
import passport from 'passport';

const router = express.Router();

// pass passport for configuration
require('../config/passport')(passport);

// Routes
router.use('/start', require('./actions/start'));
router.use('/security', require('./actions/security'));
router.use('/user', require('./actions/users'));
router.use('/tasks', require('./actions/tasks'));

export default router;
