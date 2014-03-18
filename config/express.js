var express = require('express');
var mongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
var favicon = require('static-favicon');
var winston = require('winston');
var helpers = require('view-helpers');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pkg = require('../package.json');

var env = process.env.NODE_ENV || 'development';

// Configure Express
module.exports = function(app, config, passport) {
    app.set('showStackError', true);

    app.use(express.compress({
        filter: function(req, res) {
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // Logging
    // Use winston on production
    var log;
    if (env !== 'development') {
        log = {
            stream: {
                write: function(message, encoding) {
                    winston.info(message);
                }
            }
        };
    } else {
        log = 'dev';
    }
    // Don't log during tests
    if (env !== 'test') {
        app.use(express.logger(log));
    }

    // View engine setup
    app.set('view engine', 'html');
    app.set('layout', 'layout/layout');
    app.set('view options', { layout: true });

    app.set('partials', {
        header: 'layout/header',
        footer: 'layout/footer'
    });

    //app.enable('view cache');
    app.engine('html', require('hogan-express'));

    app.set('views', config.root + '/app/views');

    //app.use(favicon(config.root + '/public/favicon.ico'));
    app.use(require('stylus').middleware(config.root + '/public'));
    app.use(express.static(config.root + '/public'));

    app.configure(function() {
        // Expose package.json to views
        app.use(function(req, res, next) {
            res.locals.pkg = pkg;
            next();
        });

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded());
        app.use(cookieParser());
        app.use(express.methodOverride());

        // Express/Mongo session storage
        app.use(express.session({
            secret: 'kevins underage girlfriend!',
            store: new mongoStore({
                url: config.db,
                collection: 'sessions'
            })
        }));

        // Use passport session
        app.use(passport.initialize());
        app.use(passport.session());

        // Connect flash for flash messages
        app.use(flash());

        app.use(helpers(pkg.name));

        // Add CSRF protection
        if (process.env.NODE_ENV !== 'test') {
            app.use(express.csrf());

            app.use(function(req, res, next) {
                res.locals.csrf_token = req.csrfToken();
                next();
            });
        }

        // Hook up the router
        app.use(app.router);

        // Error handlers

        // catch 404 and forward to error handler
        app.use(function(err, req, res, next) {
            // treat as 404
            if (err.message
                && (~err.message.indexOf('not found')
                || (~err.message.indexOf('Cast to ObjectId failed')))) {
                return next();
            }

            // log it
            console.error(err.stack);

            // error page
            res.status(500).render('500', { error: err.stack });
        });


        // assume 404 since no middleware responded
        app.use(function(req, res, next){
            res.status(404).render('404', {
                url: req.originalUrl
            });
        });
    });

    app.configure('development', function() {
        app.locals.pretty = true;
    });
}
