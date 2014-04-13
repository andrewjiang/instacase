/* GET home page */
exports.index = function(req, res) {
    res.render('cases/index', {
        title: 'Instacase',
        user: req.user
    });
};

/* GET create case */
exports.create = function(req, res) {
    res.render('cases/create');
};
