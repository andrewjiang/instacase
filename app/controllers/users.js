var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../../lib/utils');

var login = function(req, res) {
    var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
}

exports.signin = function(req, res) {}

exports.authCallback = login;

exports.login = function(req, res) {
    res.render('users/login', {
        title: 'Login',
        message: req.flash('error')
    });
};

exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

exports.session = login;

exports.create = function(req, res) {
    var user = new User(req.body);
    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            return res.render('users/signup', {
                error: utils.errors(err.errors),
                user: user,
                title: 'Sign up'
            });
        }

        // Log the user in!
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    });
};

exports.show = function(req, res) {
    var user = req.profile;
    res.render('users/show', {
        title: user.displayName(),
        user: user
    });
}

exports.user = function(req, res, next, id) {
    User
        .findOne({ _id: id })
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
}
