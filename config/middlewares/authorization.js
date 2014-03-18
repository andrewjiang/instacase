// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
exports.requiresLogin = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    if (req.method == 'GET') req.session.returnTo = req.originalUrl;
    res.redirect('/login');
};

// User authorization routing middleware.
//   Restrict access to only the users' profile page
exports.user = {
    hasAuthorization: function (req, res, next) {
        if (req.profile.id != req.user.id) {
            req.flash('info', 'You are not authorized');
            return res.redirect('/users/' + req.profile.id);
        }
        next():
    }
}
