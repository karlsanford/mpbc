const envars = require('../../envars');

/**
 * Created by karl on 9/15/2018.
 */
const envars = require('../../envars')
const googleMapsClient = require('@google/maps').createClient({
  //TODO move to env var
    key: envars.googleKey,
    Promise: Promise
});

let i = 0
let k = 0

function addLocationDetails(locations){
    console.log('\x1b[33m%s\x1b[0m', 'addLocationDetails()...')
    for( j = 0; j < 3; j++){
        console.log('location['+j+']: ',locations[j])
    }

    return new Promise((fulfill,reject)=> {
      let promisedPlaces = locations.map(location=>{
        findPlace(location)
          .then(result=>{
            return findPlaceDetails(result)
          })
          .catch(err => {
            return err;
          })
      })

      Promise.all(promisedPlaces)
        .then((locations)=>{
          console.log('locations1:',JSON.stringify(locations))
          fulfill(locations)
      })
        .catch((err)=>{
          console.log('promise.all err: ' + err)
          reject({
              error: err,
              callStack: '.catch > Promise.all > findPlaceDetails > findPlace > new Promise > addLocationDetails > googlePlaces.js'
          })
        })
    })
}

function findPlace(item) {
    logger('FgYellow','findPlace' + i++ + JSON.stringify(item) );
    return new Promise((resolve,reject)=>{
        let query = item.src_locationName + ' ' + item.src_locationAddress;
        googleMapsClient.findPlace({input: query, inputtype: 'textquery'})
            .asPromise()
            .then((res)=> {
              if(res.json.candidates.lenght > 0){
                item.g_candidates = res.json.candidates;
                //pick the "top" candidate
                item.g_place_id = item.g_candidates[0].place_id;
                resolve(item)
              } else {
                findPlaceByAddressOnly(item)
                  .then((res)=>{
                    resolve(item)
                  })
                  .catch(err=>{
                    reject(err)
                  })
              }

            })
            .catch((err) => {
              console.log('googleMapsClient.findPlace failed. query: ' + query);
              reject({
                  error: err,
                  callStack: '.catch > googleMapsClient > findPlace > googlePlace.js'
              });
            })
    })
}

function findPlaceByAddressOnly(item) {
  return new Promise((resolve,reject)=>{
    let query = item.src_locationAddress;
    googleMapsClient.findPlace({input: query, inputtype: 'textquery'})
      .asPromise()
      .then((res)=>{
        if(res.json.candidates.length > 0){
          item.g_candidates = res.json.candidates;
          item.g_place_id = item.g_candidates[0].place_id;
          resolve(item)
        } else {
          reject(Error('google could not find match by address only'))
        }
      })
  })
}

function findPlaceDetails(item) {
    console.log('\x1b[33m%s\x1b[0m','findPlaceDetails');
    return new Promise((resolve,reject)=>{
        if(!item.g_place_id){
            reject({
                error: 'g_place_id is falsey',
                callStack: 'if if(!item.g_place_id) > new Promise > findPlaceDetails > googlePlaces.js',
                obj: item
            })
        } else {
            googleMapsClient.place({
                    placeid: item.g_place_id,
                    fields: ['name','formatted_phone_number','opening_hours','url','website','formatted_address','geometry']
                })
                .asPromise()
                .then((res) => {
                    item.g_address = res.json.result.formatted_address
                    item.g_location = res.json.result.geometry.location
                    item.g_phone = res.json.result.formatted_phone_number
                    item.g_website = res.json.result.website
                    item.g_url = res.json.result.url
                    item.g_locationName = res.json.result.name
                    if(res.json.result.opening_hours && res.json.result.opening_hours.weekday_text){
                        item.g_hours = res.json.result.opening_hours.weekday_text
                    }
                    item.dirty = false
                    item.lastCleaned = new Date()
                    if(k<3){
                        k++
                        console.log('item['+k+']: ' + JSON.stringify(item))
                    }

                    resolve(item)
                })
                .catch((err) => {
                    reject({
                        error: err,
                        callStack: '.catch > googleMapsClient > findPlaceDetails > googlePlace.js'
                    });
                });
        }
        //console.log('item.g_place_id: ' + item.g_place_id)
    })
}

module.exports = {
    addLocationDetails: addLocationDetails,
    findPlace: findPlace,
    findPlaceDetails: findPlaceDetails
}
