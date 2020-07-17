const Fetches = require('../models/fetches')

//vendor specific
const fullclipFetch = require('../lib/fullclip/fc-data')

//API wrapper for fetchData
const fetchDataAPI = (req,res) => {
    console.log('fetchDataAPI()')
    let dataSource = req.params.dataSource;
    let dataType = req.params.dataType;

    fetchData(dataSource, dataType)
        .then(result => {
            res.status(result.httpStatus).send({
                httpStatus: result.httpStatus,
                result: result.result,
                httpNext: result.httpNext
            });
        })
        .catch(err => {
            res.status(err.httpStatus).send(err);
        });
}

//match data source to lib and fetch data
const fetchData = (dataSource, dataType) => {
    console.log('fetchData()')
    return new Promise((resolve, reject) => {
        let promise = {};
        if (dataSource === 'fullclip') {
            promise = fullclipFetch.fetchReport(dataType);
        //else if here for other datasources
        } else {
            reject({
                httpStatus: 404,
                error: 'method not found for dataSource: ' + dataSource
            });
        }
        if (promise) {
            promise
                .then(result => {
                    return _saveFetch(result, dataSource, dataType);
                })
                .then(result => {
                    resolve({
                        httpStatus: 201,
                        httpNext: 'api/clean/' + dataType,
                        result: result
                    });
                })
                .catch(err => {
                    reject({
                        httpStatus: 500,
                        error: err.error
                    });
                });
        } else {
            reject({
                httpStatus: 404,
                error: 'method did not return a promise for dataSource: ' + dataSource
            });
        }
    });
};

const _saveFetch = (fetchedData, dataSource, dataType) => {
    return new Promise((resolve, reject) => {
        let newFetch = new Fetches({
            dataSource: dataSource,
            dataType: dataType,
            fetchDate: Date.now(),
            dirty: true,
            fetchedData: fetchedData
        });
        newFetch.save((err, fetch) => {
            if (!err) {
                console.log('fetch: ', fetch)
                resolve(fetch);
            } else {
                reject({
                    error: err,
                    callStack: 'newFetch.save > new Promise > _saveFetch > fetch-controller'
                });
            }
        });
    });
  };

module.exports = {
    fetchData: fetchData,
    fetchDataAPI: fetchDataAPI
}