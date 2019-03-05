import React, { useLayoutEffect, useState, useEffect } from 'react';
import { line, curveMonotoneX } from 'd3-shape';
import { scaleTime, scaleLinear } from 'd3-scale';
import { max, extent, min } from 'd3-array';
import { DateTime } from 'luxon';

import './styles.scss';


export default function({ data = [], scrollContainer = {} }) {
  const dataWithDates = data.map(day => ({
    ...day,
    date: new Date(DateTime.fromSeconds(day.time).toUTC()),
  }));

  const [height, setHeight] = useState(window.innerHeight / 3);
  const [width, setWidth] = useState(window.innerWidth);

  const y = scaleLinear()
    .domain([
      min(dataWithDates, d => d.temperatureMin) - 2,
      max(dataWithDates, d => d.temperatureHigh) + 2
    ])
    .range([height, 0]);

  const [dayStart, dayEnd] = extent(dataWithDates, d => d.date);

  const x = scaleTime()
    .domain([
      new Date(DateTime.fromJSDate(dayStart).minus({ days: 1 }).toUTC()),
      new Date(DateTime.fromJSDate(dayEnd).plus({ days: 1}).toUTC())
    ])
    .range([0, width]);

  const getLineHigh = line()
    .x(d => x(d.date))
    .y(d => y(d.temperatureHigh))
    .curve(curveMonotoneX);

  const getLineMin = line()
    .x(d => x(d.date))
    .y(d => y(d.temperatureMin))
    .curve(curveMonotoneX);

  useLayoutEffect(() => {
    const resizer = window.addEventListener('resize', () => {
      setHeight(window.innerHeight / 3);
      setWidth(scrollContainer.current.scrollWidth);
    });
    return () => {
      window.removeEventListener('resize', resizer);
    }
  }, []);

  useEffect(() => {
    setWidth(scrollContainer.current.scrollWidth);
  }, [scrollContainer.current, dataWithDates]);


  return (
    <svg className="Chart" width={width} height={height} preserveAspectRatio="xMinYMin">
      <g>
        <path className="line" d={getLineHigh(dataWithDates)} />
        <path className="line --shadow" d={getLineMin(dataWithDates)} />
      </g>
      {dataWithDates.map(day => (
        <g key={day.time}>
          <text
            className="text"
            x={x(day.date) + 16}
            y={y(day.temperatureHigh) - 10}
          >
            {Math.floor(day.temperatureHigh)}
          </text>
          <text
            className="text --shadow"
            x={x(day.date) + 16}
            y={y(day.temperatureMin) + 15}
          >
            {Math.floor(day.temperatureMin)}
          </text>
        </g>
      ))}
      {dataWithDates.map(day => (
        <g key={day.time} >
          <circle
            className="circle"
            r="2"
            cx={x(day.date) + 1}
            cy={y(day.temperatureHigh)}
          />
          <circle
            className="circle --shadow"
            r="2"
            cx={x(day.date) + 1}
            cy={y(day.temperatureMin)}
          />
        </g>
      ))}
    </svg>
  )
}

