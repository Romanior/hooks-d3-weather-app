const express = require('express');
const request = require('request-promise-native');
const { DateTime } = require('luxon');
const cors = require('cors');

const keys = require('./keys.json');

const app = express();

const darkSkyUrl = ({ location, time = '', units = 'si' }) =>
    `https://api.darksky.net/forecast/${keys.darkSky}/${location}${time && (', ' + time)}?units=${units}`;

/**
 *  Get weather information current, forecast and in the past.
 *  http://localhost:4000/weather/[lat],[lon]?from=[timestamp]&days=[numberOfDays]
 */
app.use('/weather/:location/', cors(), function(req, res) {
  const { location } = req.params;
  const { days = 10, from } = req.query;
  let times = [''];

  if (from) {
    const fromDT = DateTime.fromSeconds(parseInt(from));

    times = [...Array(days).keys()].map((day, i) =>
        parseInt(fromDT.minus({ days: i + 1 }).toSeconds()));
  }

  const promises = times.map(time => request(darkSkyUrl({ location, time })));

  Promise.all(promises).then(data => res.json(data.map(t => JSON.parse(t))));
});

app.listen(4000);
