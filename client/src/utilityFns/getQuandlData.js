const { REACT_APP_QUANDL_KEY } = process.env;

export default function getQuandlUrl(stockCode) {
  return fetch(
    `https://www.quandl.com/api/v3/datasets/WIKI/${stockCode}.json?limit=128&api_key=${REACT_APP_QUANDL_KEY}`
  )
    .then(res => res.json())
    .catch(e => console.log('fetch error', e));
}
