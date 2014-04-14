var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storefrontSchema = Schema({
    name: { type: String, required: true },
    short_name: { type: String, required: true }
});

mongoose.model('Storefront', storefrontSchema);
