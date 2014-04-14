var express = require('express');
var winston = require('winston');
var expressWinston = require('express-winston');

var env = process.env.NODE_ENV || 'development';

// Configure Express
module.exports = function(app, config, passport) {
    app.set('showStackError', true);

    app.use(require('compression')({
        filter: function(req, res) {
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    //app.enable('view cache');
    app.engine('handlebars', require('express3-handlebars')({
        layoutsDir: config.root + '/app/views/layout',
        defaultLayout: 'layout',
        partialsDir: [
            config.root + '/app/views/layout'
        ]
    }));
    app.set('view engine', 'handlebars');

    app.set('views', config.root + '/app/views');

    //app.use(require('static-favicon')(config.root + '/public/favicon.ico'));
    app.use(require('stylus').middleware(config.root + '/public'));
    app.use(express.static(config.root + '/public'));

    // Expose package.json to views
    var pkg = require('../package.json');
    app.use(function(req, res, next) {
        res.locals.pkg = pkg;
        next();
    });

    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(require('cookie-parser')());
    app.use(require('method-override')());

    // Express/Mongo session storage
    var session = require('express-session');
    var mongoStore = require('connect-mongo')({session: session});
    app.use(session({
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
    app.use(require('connect-flash')());

    app.use(require('view-helpers')(pkg.name));

    // Add CSRF protection
    if (process.env.NODE_ENV !== 'test') {
        app.use(require('csurf')());

        app.use(function(req, res, next) {
            res.locals.csrf_token = req.csrfToken();
            next();
        });
    }

    // Add subdomain support
    app.use(require('express-subdomain-handler')({ baseUrl: 'battletrophy.com' }));

    // Hook up the logger
    app.use(expressWinston.logger({
        transports: [
            new winston.transports.Console({
                colorize: true
            })
        ]
    }));

    // Hook up the router
    var auth = require('./middlewares/authorization');
    require('./routes')(app, passport, auth);

    // Hook up the error logger
    app.use(expressWinston.errorLogger({
        transports: [
            new winston.transports.Console({
                json: true,
                colorize: true
            })
        ]
    }));

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

    if ('development' == env) {
        app.locals.pretty = true;
    }
}
