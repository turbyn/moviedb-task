const axios = require('axios');
const {apikey} = require('../config/config.json');

const getMovieDetails = (movieTitle) => {
  const targetUrl = createUrl(movieTitle,apikey)
  axios.get(targetUrl).then((res) => {
    console.log(res);
  }).catch((e) => {
    throw new Error(e);
  })
}

const handleResponse = (res) => {
  console.log(res);
}

const createUrl = (movieTitle, apikey) => {
  return 'http://www.omdbapi.com/?t='+encodeURI(movieTitle)+'&apikey='+apikey;
}

module.exports = {
  getMovieDetails
}
