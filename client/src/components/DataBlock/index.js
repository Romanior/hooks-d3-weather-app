import React, { Fragment, useLayoutEffect, useRef, useEffect, useState } from 'react';
import handleViewport from 'react-in-viewport';
import { DateTime } from 'luxon';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';

import './style.scss';

const ItemLoader = handleViewport(
    ({ innerRef }) => <li className="block --moody" ref={innerRef}><Spinner /></li>
);

export default function({ data = [], loadMoreData = () => {}, renderFixedItem = () => {} }) {
  const scrollContainer = useRef();
  const [showLoadingMore, setShowLoadingMore] = useState(false);

  const [dataLength, setDataLength] = useState({});

  const apiDaysFromTodayQty = 8;

  const { current: element } = scrollContainer;

  useEffect(() => {
    const diffWithPreviousData = data.length - dataLength;
    if (diffWithPreviousData) {
      const items = Array.from(element.querySelectorAll('[data-item]'));
      const itemToScroll = items[diffWithPreviousData - 1];
      element.scrollLeft = itemToScroll.offsetLeft;
    }

    if (data.length > 0) {
      setShowLoadingMore(true);
    }
  }, [data]);

  useLayoutEffect(() => {
    // touch devices work well with horizontal scroll
    // just fix for the mouse wheel
    if (element) {
      const wheeler = element.addEventListener('wheel', (e) => {
        const { deltaY } = e;
        element.scrollLeft -= (deltaY * 20);
        e.preventDefault();
      });

      return () => {
        element.removeEventListener('wheel', wheeler);
      }
    }
  }, [element]);

  const todayIndex = data.length - apiDaysFromTodayQty;

  const handleLoadMore = () => {
    if (dataLength !== data.length) {
      setDataLength(data.length);
      return loadMoreData(data[0] && data[0].time);
    }
  };

  return (
    <ul className="DataBlock" ref={scrollContainer}>
      {showLoadingMore &&
        <ItemLoader
          onEnterViewport={handleLoadMore}
        />
      }
      {data.map((day, i) => (
        <li key={i} className={i < todayIndex ? "block --moody" : "block"} data-item>
          <h1 className="title">
            {i === todayIndex ?
              "Today" :
              <Fragment>
                {day.time && DateTime.fromSeconds(parseInt(day.time)).toLocaleString({
                  weekday: 'short',
                  day: 'numeric',
                  month: 'numeric'
                })}
              </Fragment>
            }
          </h1>

          <div className="info">

            <h2 className="subtitle">
              <span className="sup">{Math.floor(day.temperatureHigh)}</span>
              <span className="sub">{Math.round(day.temperatureMin)}</span>
            </h2>

            <Icon name={day.icon}/>
          </div>

          <summary className="subtitle">
            <p className="fixed">{day.summary}</p>
            <p>Precip: <strong>{Math.floor(day.precipProbability * 100)}%</strong></p>
          </summary>
        </li>
      ))}

      <li>
        {renderFixedItem(data, scrollContainer)}
      </li>
    </ul>
  )
}
