import React, { useEffect, useState, Fragment } from 'react';
import getWeather from 'api';
import Chart from 'components/Chart';
import Spinner from 'components/Spinner';
import DataBlock from 'components/DataBlock';

import './styles.scss';

export default function({ location }) {
  const [weatherData, setWeatherData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const createDays = (arr) => arr.map(d => ({ ...d.daily.data[0] })).reverse();

  useEffect(() => {
    getWeather(location).then((forecast) => {
      const forecastDays = forecast[0].daily.data;
      setWeatherData(forecastDays);
      setIsLoading(false);
    });
  },[]);

  const loadMoreData = (from) => {
    if (from) {
      getWeather(location, from).then(data => setWeatherData([...createDays(data), ...weatherData]));
    }
  };

  return (
    <Fragment>
      {isLoading ?
        <Spinner/>
        :
        <DataBlock
          data={weatherData}
          loadMoreData={loadMoreData}
          renderFixedItem={(data, scrollContainer) => (
            <Chart
              data={data}
              scrollContainer={scrollContainer}
            />
          )}
        />
      }
    </Fragment>
  )
}
