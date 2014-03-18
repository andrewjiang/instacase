/* GET home page */
exports.index = function(req, res) {
    res.locals = {
        title: 'Instacase',
        user: req.user
    };
    res.render('cases/index');
};

/* GET create case */
exports.create = function(req, res) {
    res.render('cases/create');
};
