'use strict';

let express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    middlewares = require('./middlewares'),
    container = require('./components/container'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    port = process.env.PORT || 3001,
    errors = container.component('errors');

app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') !== 'production') {
  // api documentation
  app.use('/apidoc', express.static(`${__dirname}/public/documentation/api`));
}

// middlewares
app.use(middlewares.http);

// controllers
app.use(require('./controllers'));

// catch 404 and forward to error handler
app.use((req, res, next) => next(new errors.NotFound()));

// error handler
app.use(container.service('error-handler'));

server.listen(port, () => {
  console.log(`TodoList started on localhost:${port}`);
});