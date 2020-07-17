const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')

module.exports = (app, express, config) => {
    app.use(express.static(path.join(config.rootPath, 'client')));
    app.use(expressLayouts);
    app.set('view engine', 'ejs');
    app.set('views', config.rootPath + '/server/views')
    app.use(morgan('dev', 'combined'));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
}


