import React from 'react';

export default function StockChips({ currentStocks, handleListItemClick }) {
  return (
    <ul>
      {currentStocks ? (
        currentStocks.map(({ _id, stockName }, idx) => (
          <li key={`stockChip${idx}`} className="chip orange">
            {stockName}
            <i
              data-dbid={_id}
              onClick={handleListItemClick}
              className="close material-icons"
            >
              close
            </i>
          </li>
        ))
      ) : (
        <li>No current stocks</li>
      )}
    </ul>
  );
}
