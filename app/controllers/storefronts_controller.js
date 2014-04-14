/* GET storefront */
exports.show = function(req, res) {
    res.render('storefronts/show', {
        name: req.params.storeName
    });
}
