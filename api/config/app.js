import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import expressWinston from 'express-winston';
import helmet from 'helmet';
import winstonInstance from './winston';
import config from './env';
import path from 'path';
import middlewares from '../middlewares';
import container from '../components/container';
import passport from 'passport';

const app = express(),
      errors = container.component('errors'),
      debug = require('debug')('index');

if (config.env === 'development') {
    app.use(logger('dev'));
}

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

// parse body params and attache them to req.body
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));

app.use(express.static(path.join(__dirname, '../public')));

app.use(cookieParser());
app.use(compress()); //not required
app.use(methodOverride()); //not required

// secure apps by setting various HTTP headers
app.use(helmet());

// middlewares
app.use(middlewares.http);

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Use the passport package in our application
app.use(passport.initialize());

if (app.get('env') !== 'production') {
    // api documentation
    app.use('/apidoc', express.static(path.join(__dirname, '../public/documentation/api')));
}

// enable detailed API logging in dev env
if (config.env === 'development') {
    expressWinston.requestWhitelist.push('body');
    expressWinston.responseWhitelist.push('body');
    app.use(expressWinston.logger({
        winstonInstance,
        meta: true, // optional: log meta data about request (defaults to true)
        msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    }));
}

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
    app.use(expressWinston.errorLogger({
        winstonInstance
    }));
}

// controllers
app.use(require('../controllers'));

// catch 404 and forward to error handler
app.use((req, res, next) => next(new errors.NotFound()));

// error handler
app.use(container.service('error-handler'));

export default app;
