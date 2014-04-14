var mongoose = require('mongoose');
var Storefront = mongoose.model('Storefront');

/* GET storefront */
exports.show = function(req, res) {
    if (req.storefront) {
        res.render('storefronts/show', {
            name: req.params.storeName // todo: pull from model itself
        });
    }
    else {
        req.flash('info', ['No storefront found by that name!']);
        res.redirect('/');
    }
}

exports.checkStoreName = function(req, res, next, name) {
    Storefront
        .findOne({ short_name: name })
        .exec(function (err, storefront) {
            if (err) return next(err);
            req.storefront = storefront;
            next();
        });
};
