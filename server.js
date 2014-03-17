/*
  TODO: use this layout: https://github.com/madhums/node-express-mongoose-demo
  TODO: break out config into config files etc
*/

var debug = require('debug')('instacase');

// Import server-related libraries
var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Import utility libraries
var _ = require('underscore');
var validator = require('validator');

debug('Booting Instacase');

// Set up the DB
var mongoose = require('mongoose'); // Mongo ODM
var MONGO_URL = process.env.MONGOHQ_URL || 'mongodb://localhost/instacase';
debug('Connecting to MongoDB at ' + MONGO_URL);

mongoose.connect(MONGO_URL, function(err, res) {
    if (err) {
        console.error('Could not connect to MongoDB at ' + MONGO_URL + '. ' + err);
    } else {
        debug('Connected to MongoDB at ' + MONGO_URL);
    }
});

// Set up models
var Schema = mongoose.Schema;
var userSchema = Schema({
    name: {
        first: { type: String, trim: true },
        last: { type: String, trim: true}
    },
    email: { type: String, trim: true, required: true},
    address: [{ type: Schema.Types.ObjectId, ref: 'Address' }]
});

var addressSchema = Schema({
    name: { type: String, required: true },
    line_one: { type: String, required: true },
    line_two: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
});

var User = mongoose.model('Users', userSchema);
var Address = mongoose.model('Address', addressSchema);


// Facebook OAUTH config
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var FACEBOOK_APP_ID = '236858273165593';
var FACEBOOK_APP_SECRET = '1a1c8584fd3ed34796f39ba5f826d4d7';
var FACEBOOK_OAUTH_CALLBACK_URL =
        (process.env.NODE_ENV === 'production'
            ? 'http://instacase.herokuapp.com/auth/facebook/callback'
            : 'http://localhost:3000/auth/facebook/callback');

var routes = require('./routes');
var users = require('./routes/user');


// Set up the app!
var app = express();


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Set up facebook auth bindings

// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: FACEBOOK_OAUTH_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
        /*
        User.findOrCreate(..., function(err, user) {
            if (err) { return done(err); }
            done(null, user);
        })
        */
    }
));


// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// Configure Express
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.session({ secret: 'kevins underage girlfriend!' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);


// Util methods
function authUser(user) {
    var emails = _.map(user.emails, function(email) { return email.value; });
    User.find({ email: { $in: emails } })
        .exec(_.partial(function(userInfo, err, users) {
            if (users.length === 0) {
                var newUser = new User({
                    name: {
                        first: userInfo.name.givenName,
                        last: userInfo.name.familyName
                    },
                    email: userInfo.emails[0].value
                });

                newUser.save(function(err, user) {
                    if (err) {
                        // TODO: pass this onto the frontend?
                        return console.error(err);
                    }
                });
            }
        }, user));
}


// Views

app.get('/', routes.index);

app.get('/user/login', users.login);
app.get('/user/account', ensureAuthenticated, users.account);
app.get('/user/logout', users.logout);

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['basic_info', 'email'] })
);

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),

    // Successful authentication.
    function(req, res) {
        // Check for user account
        authUser(req.user);

        // Redirect home
        res.redirect('/');
    }
);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}


app.set('port', process.env.PORT || 3000);
debug('Setting port to ' + app.get('port'));

// TODO: should this be exposed?
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

// expose app
module.exports = app;
