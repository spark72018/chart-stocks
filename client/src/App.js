import React, { Component } from 'react';
import { LineSeries } from 'react-vis';
import io from 'socket.io-client';
import SweetAlert from 'sweetalert2-react';
import getQuandlData from './utilityFns/getQuandlData';
import getChartData from './utilityFns/getChartData';
import isAnEighthIndex from './utilityFns/isAnEighthIndex';
import getDateValue from './utilityFns/getDateValue';
import replacePeriodsWith from './utilityFns/replacePeriodsWith';
import { API_URI } from './constants';
import Plot from './components/Plot';
import AddStocks from './components/AddStocks';
import StockChips from './components/StockChips';
import './App.css';

class App extends Component {
  state = {
    currentStocks: null,
    inputVal: '',
    socket: io(API_URI),
    alreadyAdded: false,
    addError: false,
    crosshairValues: [],
    lineColorsUsed: [],
    toolTipCoords: null
  };

  componentDidMount() {
    const { socket } = this.state;

    return this.initSocket(socket);
  }

  initSocket = socket => {
    socket.on('getStocks', this.setCurrentStocks);
    socket.on('update', this.setCurrentStocks);
    socket.on('alreadyAdded', this.handleAlreadyAdded);
    socket.on('addError', this.handleAddError);
  };

  resetToolTipCoords = () => this.setState({ toolTipCoords: null });

  handleAddError = () => this.setState({ addError: true });

  handleAlreadyAdded = () => {
    this.setState({ alreadyAdded: true });
  };

  setCurrentStocks = ({ currentStocks = null }) =>
    this.setState({ currentStocks });

  getFormattedStockData = async stockCode => {
    try {
      const res = await getQuandlData(stockCode);
      const { data, dataset_code } = res.dataset;
      const stockInfo = getChartData(data);

      return { stockName: dataset_code, stockInfo };
    } catch (e) {
      console.error('getFormattedStockData e', e);
      this.setState({ addError: true });
    }
  };

  getInputValFromSibling = ({ target }) => target.previousSibling.value;

  handleButtonClick = async e => {
    e.preventDefault();

    const replacer = replacePeriodsWith('_');
    const { inputVal, socket } = this.state;
    let stockCode = inputVal.trim().toUpperCase();

    try {
      if (stockCode.indexOf('.') > -1) {
        stockCode = replacer(stockCode);
      }
      const data = await this.getFormattedStockData(stockCode);

      socket.emit('addStock', data);
    } catch (e) {
      console.log('handleClick error', e);
      this.setState({ addError: true });
    }
  };

  handleChange = e => {
    const { inputVal } = this.state;
    return inputVal.length < 10
      ? this.setState({ inputVal: e.target.value })
      : this.setState({ inputVal: '' });
  };

  handleListItemClick = e => {
    const { dbid: dbId } = e.target.dataset;
    const { socket } = this.state;

    socket.emit('removeStock', dbId);
  };

  makeAllLineSeries = arr => {
    const result = arr.map(({ stockName, stockInfo }, idx) => (
      <LineSeries
        key={`series${idx}`}
        onNearestX={idx === 0 ? this.handleNearestX : undefined}
        data={stockInfo.map(({ date, price }) => ({
          name: stockName,
          x: date,
          y: price
        }))}
      />
    ));

    return result;
  };

  hasDateValue = x => ({ date }) => date === x;

  makeCrosshairData = ({ stockName, stockInfo }) => {};

  handleNearestX = (point, e) => {
    const { x, y } = point;
    const { currentStocks, crosshairValues } = this.state;
    const updatedValues = currentStocks.map(({ stockName, stockInfo }) => ({
      name: stockName,
      info: stockInfo.find(this.hasDateValue(x))
    }));

    return this.setState({ crosshairValues: updatedValues });
  };

  resetCrosshairValues = () => this.setState({ crosshairValues: [] });

  makeToolTipList = arr =>
    arr.map(({ name, info: { price } }, i) => (
      <li key={`tooltipItem${i}`}>{`${name}: ${price}`}</li>
    ));

  makeToolTipContent = arr => {
    if (arr.length === 0) {
      return null;
    }
    const { date } = arr[0].info;
    const { toolTipCoords } = this.state;
    return toolTipCoords ? (
      <div style={{ top: toolTipCoords.y, left: toolTipCoords.x }} id="tooltip">
        <h6>{date}</h6>
        <ul>{this.makeToolTipList(arr)}</ul>
      </div>
    ) : (
      <div id="tooltip" className="tooltip">
        <h6>{date}</h6>
        <ul>{this.makeToolTipList(arr)}</ul>
      </div>
    );
  };

  getTickValues = stocksArr =>
    stocksArr[0].stockInfo.filter(isAnEighthIndex).map(getDateValue);

  handleMouseMove = e => {
    const { clientX, clientY } = e;

    const xCoordAlignedWithPointer = clientX - 275;
    const yCoordAlignedWithPointer = clientY - 5;

    return this.setState({
      toolTipCoords: {
        x: xCoordAlignedWithPointer,
        y: yCoordAlignedWithPointer
      }
    });
  };

  render() {
    const {
      currentStocks,
      inputVal,
      alreadyAdded,
      crosshairValues,
      addError
    } = this.state;
    const tickValues = currentStocks
      ? this.getTickValues(currentStocks)
      : undefined;

    return (
      <div className="container">
        <Plot
          currentStocks={currentStocks}
          tickValues={tickValues}
          crosshairValues={crosshairValues}
          resetCrosshairValues={this.resetCrosshairValues}
          resetToolTipCoords={this.resetToolTipCoords}
          makeToolTipContent={this.makeToolTipContent}
          makeAllLineSeries={this.makeAllLineSeries}
          handleMouseMove={this.handleMouseMove}
        />
        <SweetAlert
          show={alreadyAdded}
          title="Stock already exists"
          text="You have already added this stock"
          onConfirm={() => this.setState({ alreadyAdded: false })}
        />
        <SweetAlert
          show={addError}
          title="There was a problem adding that stock"
          text="Sorry about that!"
          onConfirm={() => this.setState({ addError: false })}
        />
        <AddStocks
          inputVal={inputVal}
          handleChange={this.handleChange}
          handleButtonClick={this.handleButtonClick}
        />
        <StockChips
          currentStocks={currentStocks}
          handleListItemClick={this.handleListItemClick}
        />
      </div>
    );
  }
}

export default App;
