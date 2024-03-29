var express = require('express');

var storefronts = express.Router();
var storefronts_controller = require('../controllers/storefronts_controller');

storefronts.param('storeName', storefronts_controller.checkStoreName);

/* GET show storefront */
storefronts.route('/:storeName')
    .get(storefronts_controller.show)

    .post(function (res, req) {
        res.json({
            wut: 'the wut'
        });
    });

module.exports = storefronts
