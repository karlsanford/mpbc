const Locations = require('../models/locations');
const Fetches = require('../models/fetches');
const Products = require('../models/products');
const Sales = require('../models/sales');

const _transferSales = (fetch) => {
  let fetchedDataArr = fetch.fetchedData;
  let config = {matchFields: ['src_compKeySrcDateCustIdProdId']};
  return Sales.upsertMany(fetchedDataArr, config);
  

};

const _transferLocations = (fetch) => {
  let fetchedDataArr = fetch.fetchedData;
  let config = {matchFields: ['src_compKeySrcCustId']};
  return Locations.upsertMany(fetchedDataArr, config);
};

const _transferProducts = (fetch) => {
  let fetchedDataArr = fetch.fetchedData;
  let config = {matchFields: ['src_compKeySrcProdId']};
  return Products.upsertMany(fetchedDataArr, config);
};

const transferCtrl = (dataType, callback) => {
  let responseObj = {};
  Fetches.find({
    dirty: true,
    dataType: dataType
  }).exec((err, fetches) => {
    if (!err && fetches.length > 0) {
      let promises = fetches.map((fetch, index) => {
        if (dataType === 'sales') return _transferSales(fetch);
        if (dataType === 'locations') return _transferLocations(fetch);
        if (dataType === 'products') return _transferProducts(fetch);
      });
      Promise.all(promises)
        .then(result => {
          fetches.forEach(fetch => {
            return fetch.dirty = false;
          });
          responseObj.records = result;
          return Fetches.upsertMany(fetches, ['_id']);
        })
        .then(result => {
          responseObj.fetches = result;
          responseObj.httpStatus = 201;
          callback(null, responseObj);
        })
        .catch(error => {
          callback({
            httpStatus: 500,
            msg: 'Error TRA001: ' + error
          });
        });
    } else if (!err && fetches.length === 0) {
      callback({
        httpStatus: 404,
        msg: 'no dirty fetches of ' + dataType + ' dataType found or no method found for dataType'
      });
    } else {
      callback({
        httpStatus: 500,
        msg: 'Error TRA002:'  + err
      });
    }
  });
};

const transferAPI = (req, res) => {
  //res.status(201).send({msg: 'working from here 001'})
  let dataType = req.params.dataType;

  //TODO why
  const callback = (err, result) => {
    if (!err) {
      res.status(result.httpStatus).send(result);
    } else {
      res.status(err.httpStatus).send(err.msg);
    }
  };

  transferCtrl(dataType, callback);
};

module.exports = {
  transferCtrl: transferCtrl,
  transferAPI: transferAPI
};
