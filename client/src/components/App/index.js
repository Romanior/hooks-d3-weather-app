import React, { useState, useEffect } from 'react';
import { IconsContainer } from 'components/Icon';
import WeatherContainer from 'components/WeatherContainer';
import Spinner from 'components/Spinner';

import './styles.scss';

export default function() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const { geolocation } = navigator;

    geolocation && geolocation.getCurrentPosition(({ coords }) => {
      const { latitude, longitude } = coords;

      setLocation(`${latitude}, ${longitude}`);
    }, (e) => {
      console.error(e && e.message);
      setLocation('50.8841973,4.6353907');
    }, {
      enableHighAccuracy: true,
      timeout : 3000,
      maximumAge: 0
    });
  });

  return (
    <div className="App">
      <IconsContainer />

      {location ?
        <WeatherContainer
          location={location}
        />
        :
        <Spinner />
      }
    </div>
  );
}
