import React from 'react';

export default function AddStocks({
  inputVal,
  handleChange,
  handleButtonClick
}) {
  return (
    <form className="row">
      <input
        className="col s2"
        value={inputVal}
        onChange={handleChange}
        type="text"
      />
      <button
        onClick={handleButtonClick}
        className="btn-floating btn-small waves-effect waves-light red"
      >
        <i className="material-icons">add</i>
      </button>
    </form>
  );
}
