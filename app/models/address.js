var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addressSchema = Schema({
    name: { type: String, required: true },
    line_one: { type: String, required: true },
    line_two: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
});

mongoose.model('Address', addressSchema);
