const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const stockSchema = new Schema({
  stockName: String,
  stockInfo: [
    {
      date: String,
      price: Number
    }
  ]
});

module.exports = mongoose.model('stocks', stockSchema);
