const express = require('express');
const app = express();
const port = 1492;
const mongoose = require('mongoose');
const upsertMany = require('@meanie/mongoose-upsert-many');
//const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const env = 'development';
const config = require('./server/config/config')[env];


/*********mongoose*************/
mongoose.plugin(upsertMany);
mongoose
    .connect('mongodb://localhost:27017/mpbc',{ 
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log('mongodb://localhost:27017/mpbc'))
    .catch(err => {throw new error(err)});
    
/********express*******/
//init and config
require('./server/config/express')(app, express, config)

//routes
require('./server/config/routes')(app)






//init web server
app.listen(port, () => console.log(`Listening at http://localhost:${port}`))