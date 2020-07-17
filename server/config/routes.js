const fetchCtrl = require('../controllers/fetch-ctrl')
const transferCtrl = require('../controllers/transfer-ctrl')
const cleanCtrl = require('../controllers/clean-ctrl')

module.exports = (app) => {
    //views
    app.get('/', (req,res) => res.render('index'))
    app.get('/beerfinder', (req,res) => res.render('beerfinder'))
    app.get('/beerwallet', (req,res) => res.render('beerwallet'))
    app.get('/admin', (req,res) => res.render('admin'))

    //API's
    app.get('/api/fetch/:dataSource/:dataType', fetchCtrl.fetchDataAPI)
    app.get('/api/transfer/:dataType', transferCtrl.transferAPI)
    app.get('/api/clean/:dataType', cleanCtrl.cleanDataAPI)
}


//