var express = require('express');

var storefront = express.Router();
var storefront_controller = require('../controllers/storefront_controller');

/* GET show storefront */
storefront.get('/', storefront_controller.show_create);

/* GET create storefront */
storefront.post('/', storefront_controller.do_create);

module.exports = storefront
