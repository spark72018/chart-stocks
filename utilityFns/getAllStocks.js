const mongoose = require('mongoose');
const Stock = mongoose.model('stocks');

module.exports = function getAllStocks() {
  return Stock.find({});
};
