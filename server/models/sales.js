const mongoose = require('mongoose'),
  Location = require('../models/locations'),
  Product = require('../models/products');



var salesSchema = mongoose.Schema({
    src_productName: String,
    src_qty: String,
    src_date: String,
    src_locationAddress: String,
    src_locationName: String,
    src_customerId: String,
    src_productId: String,
    src_compKeySrcDateCustIdProdId: String,
    src_productName: String,
    src: String,
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    location_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    dirty: Boolean,
    lastCleaned: Date
});

var Sale = mongoose.model('Sale',salesSchema);

module.exports = Sale;
