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
  return currentStocks ? (
    <FlexibleWidthXYPlot
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
