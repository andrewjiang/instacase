var express = require('express');
var storefronts = require('../controllers/storefronts_controller');

var storefront = express.Router();

storefront.get('/:storeName', storefronts.show);

module.exports = storefront
