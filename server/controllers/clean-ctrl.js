const googlePlaces = require('../lib/googlePlaces');
const Locations = require('../models/locations');
const Fetches = require('../models/fetches');
const Products = require('../models/products');
const Sales = require('../models/sales');


const _markAsClean = (cleanRecord) => {
  return new Promise((resolve, reject) => {
    cleanRecord.dirty = false;
    resolve(cleanRecord);
  });
};

const _cleanLocations = () => {
  return new Promise((resolve, reject) => {
    Locations.find({
      dirty: true
    }).exec((err, dirtyLocations) => {
      let promises = dirtyLocations.map((dirtyLocation, index) => {
        return googlePlaces.findPlace(dirtyLocation)
          .then(locationWithPlaceId => {
            return googlePlaces.findPlaceDetails(locationWithPlaceId);
          })
          .then(cleanRecord => {
            return _markAsClean(cleanRecord);
          })
          .catch(error => {
            return ({
              error: error
            });
          });
      });
      Promise.all(promises)
        .then(updatedLocations => {
          let matchedFields = ['src_compKeySrcCustId'];
          return Locations.upsertMany(updatedLocations, matchedFields);
        })
        .then(result => {
          resolve(result);
        })
        .catch(err2 => {
          reject(err2);
        });
    });
  });
};

const _cleanLocationInPlace = (location) => {
  return new Promise((resolve, reject) => {
    googlePlaces.findPlace(location)
      .then(locationWithPlaceId => {
        return googlePlaces.findPlaceDetails(locationWithPlaceId);
      })
      .then(result => {
        let newLocation = new Locations(result);
        newLocation.save((err, saveResult) => {
          if (!err) {
            resolve(saveResult);
          } else {
            reject({
              error: err,
              callStack: 'newLocation.save > .then > _cleanLocationInPlace > clean-controller.js'
            });
          }
        });
      })
      .catch(err => {
        reject({
          error: err,
          callStack: '.catch > googlePlaces.findPlaceDetails > googlePlaces.findPlace > _cleanLocationInPlace'
        });
      });
  });
};

const _cleanProducts = () => {
  let userValues = {
    fullclip: {
      //Half-Life
      '2421': {
        'user_productName': 'Half-Life',
        'user_productType': 'Package',
        'user_productUnit': 'Cases',
        'user_qty': 24
      },
      '1664': {
        'user_productName': 'Half-Life',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '1663': {
        'user_productName': 'Half-Life',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },
      //Hoppenheimer
      '2422': {
        'user_productName': 'Hoppenheimer',
        'user_productType': 'Package',
        'user_productUnit': 'Cases',
        'user_qty': 24
      },
      '1666': {
        'user_productName': 'Hoppenheimer',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '1665': {
        'user_productName': 'Hoppenheimer',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },
      //NE
      '2424': {
        'user_productName': 'Necessary Evil',
        'user_productType': 'Package',
        'user_productUnit': 'Cases',
        'user_qty': 24
      },
      '2896': {
        'user_productName': 'Necessary Evil',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '2897': {
        'user_productName': 'Necessary Evil',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },
      //DHL
      '3136': {
        'user_productName': 'Double Half-Life',
        'user_productType': 'Package',
        'user_productUnit': 'Cases',
        'user_qty': 24
      },
      '1670': {
        'user_productName': 'Double Half-Life',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '1669': {
        'user_productName': 'Double Half-Life',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },
      //Pluto
      '2423': {
        'user_productName': 'Plutonium-239',
        'user_productType': 'Package',
        'user_productUnit': 'Cases',
        'user_qty': 24
      },
      '1668': {
        'user_productName': 'Plutonium-239',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '1667': {
        'user_productName': 'Plutonium-239',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },
      //Black Matter
      '3036': {
        'user_productName': 'Black Matter',
        'user_productType': 'Package',
        'user_productUnit': 'Cases',
        'user_qty': 24
      },
      '1662': {
        'user_productName': 'Black Matter',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '1661': {
        'user_productName': 'Black Matter',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },
      //Atomic Alliance
      '3473': {
        'user_productName': 'Atomic Alliance',
        'user_productType': 'Package',
        'user_productUnit': 'Cases',
        'user_qty': 24
      },
      '1660': {
        'user_productName': 'Atomic Alliance',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '1659': {
        'user_productName': 'Atomic Alliance',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },
      //BA
      '3343': {
        'user_productName': 'Bikini Atoll',
        'user_productType': 'Package',
        'user_productUnit': 'Cases',
        'user_qty': 24
      },
      '3194': {
        'user_productName': 'Bikini Atoll',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '3184': {
        'user_productName': 'Bikini Atoll',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },
      //Ras BA
      '3700': {
        'user_productName': 'Raspberry Bikini Atoll',
        'user_productType': 'Package',
        'user_productUnit': 'Cases',
        'user_qty': 24
      },
      '3346': {
        'user_productName': 'Raspberry Bikini Atoll',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '3729': {
        'user_productName': 'Raspberry Bikini Atoll',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },
      //KLP BA
      '3891': {
        'user_productName': 'Kime Lime Pie Bikini Atoll',
        'user_productType': 'Package',
        'user_productUnit': 'Cases',
        'user_qty': 24
      },
      '3541': {
        'user_productName': 'Kime Lime Pie Bikini Atoll',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '3785': {
        'user_productName': 'Kime Lime Pie Bikini Atoll',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },
      //BB BA
      '3651': {
        'user_productName': 'Blackberry Bikini Atoll',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      //wise monkeys
      '2425': {
        'user_productName': 'Wise Monkeys',
        'user_productType': 'Package',
        'user_productUnit': 'Cases',
        'user_qty': 24
      },
      '1965': {
        'user_productName': 'Wise Monkeys',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '2455': {
        'user_productName': 'Wise Monkeys',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },
      //bb fission
      '2109': {
        'user_productName': 'Blackberry Fission',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '2108': {
        'user_productName': 'Blackberry Fission',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },
      //10 Nano
      '58': {
        'user_productName': '10 Nano Seconds',
        'user_productType': 'Package',
        'user_productUnit': 'Cases',
        'user_qty': 24
      },
      '3064': {
        'user_productName': '10 Nano Seconds',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '3063': {
        'user_productName': '10 Nano Seconds',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },
      //Trinitite Brut IPA
      '3079': {
        'user_productName': 'Trinitite',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      //Inception
      '2298': {
        'user_productName': 'Inception',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      //Particles Collide
      '3220': {
        'user_productName': 'Particles Collide',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '3233': {
        'user_productName': 'Particles Collide',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },
      //Reaction
      '4490': {
        'user_productName': 'Reaction',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '4489': {
        'user_productName': 'Reaction',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },
      //Nitro Black Matter
      '4287': {
        'user_productName': 'Nitro Black Matter',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.167
      },
      '4286': {
        'user_productName': 'Nitro Black Matter',
        'user_productType': 'Keg',
        'user_productUnit': 'Kegs',
        'user_qty': 0.5
      },

      //Merch
      '2107': {
        'user_productName': 'Glassware - Tulip',
        'user_productType': 'Merchandise',
        'user_productUnit': 'Cases',
        'user_qty': 24
      },
      '201': {
        'user_productName': 'Glasses - 15oz',
        'user_productType': 'Merchandise',
        'user_productUnit': 'Cases',
        'user_qty': 12
      },
      '3173': {
        'user_productName': 'Glassware - Can Glasses',
        'user_productType': 'Merchandise',
        'user_productUnit': 'Cases',
        'user_qty': 36
      },
      '3739': {
        'user_productName': 'Glasses - Snifter',
        'user_productType': 'Merchandise',
        'user_productUnit': 'Cases',
        'user_qty': 24
      }


    }
  };
  return new Promise((resolve, reject) => {
    let src = 'fullclip';
    let promises = {};
    Products.find().exec()
      .then((results) => {
        promises = results.map((result, index) => {
          result.user_productName = userValues[src][result.src_productId].user_productName;
          result.user_productType = userValues[src][result.src_productId].user_productType;
          result.user_productUnit = userValues[src][result.src_productId].user_productUnit;
          result.user_qty = userValues[src][result.src_productId].user_qty;

          Products.update();
          return result;
        });
      })
      .catch((err) => {
        return err;
      });
    Promise.all(promises);
  });
};



const _updateSaleLocationId = (dirtySale) => {
  return new Promise((resolve, reject) => {
    let compKey = dirtySale.src + dirtySale.src_customerId;
    //console.log(dirtySale.src_customerId)
    i += 1;
    //console.log('compKey' + i + ': ' + compKey)
    Locations.findOne({
      src_compKeySrcCustId: compKey
    }, (err, result) => {
      if (!err && result) {
        dirtySale.location_id = result._id;

        resolve(dirtySale);
      } else {
        reject('CLN012: ' + err);
      }
    });
  });
};

const _updateSaleProductId = (dirtySale) => {
  return new Promise((resolve, reject) => {
    let compKey = dirtySale.src + dirtySale.src_productId;
    //console.log('compKey: ' + compKey)
    Products.findOne({
      src_compKeySrcProdId: compKey
    }, (err, result) => {
      if (!err && result) {
        dirtySale.product_id = result._id;
        //console.log('dirtySale: ' + dirtySale)
        resolve(dirtySale);
      } else {
        reject('CLN011: ' + err);
      }
    });
  });
};

const _cleanSales = () => {
  return new Promise((resolve, reject) => {
    //finds sales flagged as dirty and executes with callback
    Sales.find({dirty:true}).exec((err,dirtySales)=> {
      if (!err && dirtySales.length > 0) {
        //build array of promises
        let promises = dirtySales.map((dirtySale, index) => {
          return _updateSaleLocationId(dirtySale)
            .then(result => {
              return _updateSaleProductId(result);
            })
            .then(result => {
              return _markAsClean(result);
            })
            .catch((error) => {
              return (error);
            });
        });

        Promise.all(promises)
          .then(result => {
            let matchedFields = ['_id'];
            return Sales.upsertMany(result, matchedFields);
          })
          .then(result => {
            resolve(result);
          })
          .catch(error => {
            reject('CLN004: ' + error);
          });
      } else {
        reject('CLN005: ' + err);
      }
    });
  });
};

const cleanData = (dataType, callback) => {
  if (dataType === 'sales') return _cleanSales();
  if (dataType === 'locations') return _cleanLocations();
  if (dataType === 'products') return _cleanProducts();
};

//API wrapper for cleanData
const cleanDataAPI = (req, res) => {
  let dataType = req.params.dataType;
  logger('BgYellow', 'dataType = ' + dataType);

  cleanData2(dataType)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send('CLN009: ' + err);
    });
};

module.exports = {
  cleanDataAPI: cleanDataAPI,
  cleanData: cleanData
};

