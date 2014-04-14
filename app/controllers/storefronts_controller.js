var mongoose = require('mongoose');
var Storefront = mongoose.model('Storefront');

/* GET storefront */
exports.show = function(req, res) {
    res.render('storefronts/show', {
        name: req.params.storeName
    });
}

exports.checkStoreName = function(req, res, next, name) {
    Storefront
        .findOne({ short_name: name })
        .exec(function (err, storefront) {
            if (err) return next(err);
            if (!storefront) return next(new Error('No storefront found by name: ' + name));
            req.storefront = Storefront;
            next();
        });
};
