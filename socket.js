const mongoose = require('mongoose');
const Stock = mongoose.model('stocks');
const getAllStocks = require('./utilityFns/getAllStocks');

module.exports = app => {
  const http = require('http').Server(app);
  const io = require('socket.io')(http);

  io.on('connection', async socket => {
    try {
      const currentStocks = await getAllStocks();

      socket.emit('getStocks', { currentStocks });
    } catch (e) {
      console.log('getAllStocks error', e);
      socket.emit('getAllStocksError');
    }

    socket.on('addStock', async res => {
      const { stockName, stockInfo } = res;

      try {
        const isInDb = await Stock.findOne({ stockName });

        if (isInDb) {
          return socket.emit('alreadyAdded');
        }
        const stockItem = await new Stock({ stockName, stockInfo }).save();
        const currentStocks = await getAllStocks();
        const res = { currentStocks };

        socket.emit('update', res);
        return socket.broadcast.emit('update', res);
      } catch (e) {
        console.log('addStock error', e);
        return socket.emit('addError', e);
      }
    });

    socket.on('removeStock', async dbId => {
      const removedStock = await Stock.findOneAndRemove({ _id: dbId });
      const currentStocks = await getAllStocks();

      const res = { currentStocks };

      socket.emit('update', res);
      socket.broadcast.emit('update', res);
    });
    socket.on('disconnect', () => console.log('Client disconnected'));
  });

  const PORT = process.env.PORT || 8000;

  http.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
};
