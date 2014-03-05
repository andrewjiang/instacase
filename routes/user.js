/* GET user login */
exports.login = function(req, res) {
    res.render('login', { user: req.user });
};

/* GET user account */
exports.account = function(req, res) {
    res.render('account', { user: req.user });
};

/* GET user logout */
exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};
