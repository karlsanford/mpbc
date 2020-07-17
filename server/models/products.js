var mongoose = require('mongoose');

var productsSchema = mongoose.Schema({
  'src': String,
  'src_productName': String,
  'src_productId': String,
  'src_supplierProductId': String,
  'src_productType': String,
  'src_qty': Number,
  'src_compKeySrcProdId': String,
  'dirty': Boolean,
  'user_productName':String,
  'user_productType': String,
  'user_productUnit': String,
  'user_productId': String,
  'user_supplierProductId': String,
  'user_qty': Number,
  'user_packageType': String,
  'user_productStyle': String,
  'user_productSubStyle':String
});

var Product = mongoose.model('Product',productsSchema);

module.exports = Product;
