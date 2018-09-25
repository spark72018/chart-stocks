import {
  DATE_INDEX,
  CLOSE_PRICE_INDEX,
  STARTING_DATE_INFO_INDEX,
  ENDING_DATE_INFO_INDEX
} from '../constants';

import ChartData from '../classes/ChartData';

const getDateStr = arr => arr[DATE_INDEX];

const getClosePriceStr = arr => arr[CLOSE_PRICE_INDEX];

export default function getChartData(data) {
  const resultArr = [];

  for (let i = STARTING_DATE_INFO_INDEX; i >= ENDING_DATE_INFO_INDEX; i--) {
    const date = getDateStr(data[i]);
    const price = getClosePriceStr(data[i]);

    resultArr.push(new ChartData(date, price));
  }

  console.log('resultArr is', resultArr);

  return resultArr;
}
