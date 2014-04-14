var express = require('express');

var storefront = express.Router();
var storefronts = require('../controllers/storefronts_controller');

storefront.param('storeName', storefronts.checkStoreName);

/* GET show storefront */
storefront.route('/:storeName')
    .get(storefronts.show);

module.exports = storefront
