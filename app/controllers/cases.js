/* GET home page. */
exports.index = function(req, res) {
    res.render('cases/index', {
        title: 'Instacase',
        user: req.user
    });
};
