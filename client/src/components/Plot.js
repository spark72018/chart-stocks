import React from 'react';
import {
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  YAxis,
  LineSeries,
  Borders,
  FlexibleWidthXYPlot,
  Crosshair
} from 'react-vis';

export default function Plot({
  currentStocks,
  tickValues,
  crosshairValues,
  resetCrosshairValues,
  resetToolTipCoords,
  makeToolTipContent,
  makeAllLineSeries,
  handleMouseMove
}) {
  const margin = { left: 100, right: 100 };

  return currentStocks ? (
    <FlexibleWidthXYPlot
      margin={margin}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        resetCrosshairValues();
        resetToolTipCoords();
      }}
      xType="ordinal"
      height={400}
    >
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis title="Date" tickValues={tickValues} />
      <YAxis title="Closing Price" />
      <Crosshair values={crosshairValues}>
        {makeToolTipContent(crosshairValues)}
      </Crosshair>
      {makeAllLineSeries(currentStocks)}
    </FlexibleWidthXYPlot>
  ) : null;
}
