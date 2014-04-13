var async = require('async');

// Load controllers
var users = require('../app/controllers/users');
var cases = require('../app/controllers/cases');

// Expose routes
module.exports = function(app, passport, auth) {
    // Home
    app.get('/', cases.index);

    // Create a new case
    app.get('/cases/create', cases.create);

    app.get('/login', users.login);
    app.get('/logout', users.logout);

    app.post('/users', users.create);
    app.get('/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.show);

    // Local auth strategy
    app.get('/signup', users.signup);
    app.post('/users/session',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: 'Invalid email or password.'
        }),
        users.session
    );

    // GET /auth/facebook
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Facebook authentication will involve
    //   redirecting the user to facebook.com.  After authorization, Facebook will
    //   redirect the user back to this application at /auth/facebook/callback
    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope: ['basic_info', 'email'],
            failureRedirect: '/login'
        }),
        users.signin
    );

    // GET /auth/facebook/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/login'
        }),
        users.authCallback
    );
};
