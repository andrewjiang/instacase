var mongoose = require('mongoose');
var Storefront = mongoose.model('Storefront');
var domain = require('../util/domain');

/* GET storefront */
exports.show = function(req, res) {
    if (req.storefront) {
        res.render('storefronts/show', {
            name: req.storefront.name,
            store_url: 'https://' + req.storefront.short_name + '.battletrophy.com'
        });
    }
    else {
        req.flash('warning', 'No storefront found by that name!');
        res.redirect(domain.getUrl());
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
