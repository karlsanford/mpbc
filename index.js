const express = require('express');
const app = express();
const port = 1492;

const mongoose = require('mongoose')


//express
app.get('/', (req,res) => res.send('Hello World'))

//mongoose
mongoose.connect('mongodb://localhost:27017/mpbc');


//init web server
app.listen(port, () => console.log(`Listening at http://localhost:${port}`))