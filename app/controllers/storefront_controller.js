var mongoose = require('mongoose');
var Storefront = mongoose.model('Storefront');

/* GET storefront */
exports.show_create = function(req, res) {
    res.render('storefront/create');
}

/* POST create storefront */
exports.do_create = function(req, res) {
    req.checkBody('name', 'Please fill out a store front name').notEmpty();
    req.checkBody('short_name', 'Please fill out a store front URL').notEmpty();
    req.checkBody('short_name', 'Store URL can only be lowercase letters and - (dashes)').matches(/^[A-Za-z0-9-]*$/);

    var errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(function (error) { return error.msg; }));
        return res.render('storefront/create', {
            name: req.body.name,
            short_name: req.body.short_name,
            error: req.flash('error')
        });
    }

    Storefront
        .findOne({ short_name: req.body.name })
        .exec(function(err, storefront) {
            if (err) return next(err);

            if (storefront) {
                req.flash('error', 'Store name already exists!');
                res.render('storefront/create', {
                    name: req.body.name,
                    short_name: req.body.short_name,
                    error: req.flash('error')
                });
            }
            else {
                var storefront = new Storefront();
                storefront.name = req.body.name;
                storefront.short_name = req.body.short_name;
                storefront.save(function(err) {
                    if (err) {
                        req.flash('error', 'Unable to create storefront. Please try again.');
                        return res.render('storefront/create', {
                            name: req.body.name,
                            short_name: req.body.short_name,
                            error: req.flash('error')
                        });
                    }

                    
                    // TODO: this should be a helper function in another module
                    var isProduction = 'production' === process.env.NODE_ENV;
                    var redirectUrl;

                    if (isProduction) {
                        redirectUrl = 'https://' + storefront.short_name + 'battletrophy.com';
                    }
                    else {
                        redirectUrl = '/subdomain/' + storefront.short_name;
                    }

                    req.flash('success', 'Your storefront has been created!');
                    res.redirect(redirectUrl);
                });
            }
        });
}
