const mongoose = require('mongoose')

const fetchSchema = new mongoose.Schema({
    dataType: String,
    dataSource: String,
    fetchDate: Date,
    dirty: Boolean,
    fetchedData: Object
  });
  
  const Fetch = mongoose.model('Fetch', fetchSchema );
  
  module.exports = Fetch;
  