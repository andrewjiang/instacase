var express = require('express');

var api = express.Router();
//var api_controller = require('../controllers/api_v1_controller');
api.route('/preview')
    .post(function (req, res) {
        res.json({
            'render_id': '124198741425',
            'base_price_usd': '20.00',
            'product_info': {
                'type': 'case_iphone_5'
            },
            'product_image': 'https://battletrophy.com/assets/clashofclans/124198741425.png',
            'url': 'https://clashofclans.battletrophy.com/storefront/124198741425'
        });
    });

api.route('/store')
    .post(function (req, res) {
        res.json({
            'store_id': '54323',
            'products': [
                {
                    'render_id': '124198741425',
                    'base_price_usd': '20.00',
                    'product_info': {
                        'type': 'case_iphone_5'
                    },
                    'product_image': 'https://battletrophy.com/assets/clashofclans/124198741425.png',
                    'url': 'https://clashofclans.battletrophy.com/storefront/124198741425'
                }
            ],
            'url': 'https://clashofclans.battletrophy.com/storefront'
        });
    });

module.exports = api
