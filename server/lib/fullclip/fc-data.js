'use strict';

const config = require('./config'),
  env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
  Nightmare = require('nightmare'),
  //nightmare = Nightmare({show:env == 'development'});
  nightmare = Nightmare({show:true});

let reportName = '';

const fetchReport = function(dataType){
    console.log('fetchReport() reportName:',dataType);
    return new Promise((resolve, reject) => {
        if(config.reportList.indexOf(dataType) === -1){
            reject({error: 'method not found for dataType: ' + dataType})
        } else {
            nightmare
                .goto(config.urls.login)
                .wait("#LogonForm")
                .type(config.identifiers.un_id,config.creds.username)
                .type(config.identifiers.pw_id,config.creds.password)
                .wait(500)
                .click(config.identifiers.submit_id)
                .wait("#MainMenuContent")
                .goto(config.urls.reports[dataType])
                .wait('#Report0')
                .evaluate(() => {
                    let trans = [];
                    //TODO add querySelector arg to config
                    let report = document.querySelector('#Report0');
                    let rows = report.querySelectorAll('tr');
                    for (let i=0; i<rows.length; i++){
                        let tds = rows[i].querySelectorAll('td');
                        var tmp = [];
                        for (let j=0; j<tds.length; j++) {
                            tmp.push(tds[j].textContent)
                        }
                        trans.push(tmp)
                    }
                    return trans
                })
                .end()
                .then(function(result){
                    let headers = _cleanHeaders(result[0]);
                    resolve(_arraysToObjs(result,headers,dataType));
                    //var processed = _processResult(data,dataType)
                    //fulfill(processed)
                })
                .catch(error => {
                    reject(error);
                    console.error('something went wrong in fetching the data: ', error)
                })
        }
    })
};

const _cleanHeaders = function(arr){
	let clean = [];
	arr.forEach(function(item){
		clean.push(config.dataMap[item])
	});
	return clean
};

const _arraysToObjs = function(array_obj,headers,dataType){
	let obj = [];
	let firstDataRow = 0;
	if(headers)firstDataRow=1;
	array_obj.forEach( (row,i) =>{
		if(i >= firstDataRow) {
			let tmp = {};
			row.forEach((item,index) =>{
				//TODO handle . and .00 more gracefully
				tmp[headers[index]] = item.replace('.00','').replace('.','')
			});

            tmp.src = config.src;
            tmp.dirty = true;

            //report specific mapping and cleaning
            if(dataType == 'sales'){
                var dateArr = tmp.src_date.split('/');

                if(dateArr[0].length == 1) dateArr[0] = '0' + dateArr[0];
                if(dateArr[1].length == 1) dateArr[1] = '0' + dateArr[1];

                var formatedDate = dateArr[2] + dateArr[0] + dateArr[1];
                tmp.src_compKeySrcDateCustIdProdId = tmp.src + '.' + formatedDate
                    + '.' + tmp.src_customerId + '.' + tmp.src_productId;
                tmp.src_date = new Date(dateArr[2],dateArr[0]-1,dateArr[1])
            }
            if(dataType == 'locations') {
                tmp.src_compKeySrcCustId = tmp.src + tmp.src_customerId
            }
            if(dataType == 'products') {
                tmp.c_productName = config.valueMaps.products.names[tmp.src_productName]
                tmp.src_compKeySrcProdId = tmp.src + tmp.src_productId
            }
            obj.push(tmp)
		}
	});
	return obj
};

module.exports = {
    fetchReport : fetchReport
};




