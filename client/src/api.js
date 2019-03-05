import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ?
    'http://localhost:4000/weather'
    :
    'https://files-sqwsqdmovg.now.sh/weather',
});

export default function(location, from) {
  return api.get(`/${location}`, {
    params: {
      from,
    }
  }).then(response => response.data);
}
