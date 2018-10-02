const request = require('request');
const {apikey} = require('../config/config.json');

const getMovieDetails = (movieTitle) => {
  return new Promise((resolve, reject) => {
    request(createUrl(movieTitle,apikey), (err, res, body) => {
      if(err){return reject(err);}
      try {
        const parsedApiResponse = JSON.parse(body);
        return resolve(parsedApiResponse)
      } catch (e) {
        return reject('Unable to parse response: ' + e);
      }
    })
  })
}

const handleResponse = (res) => {
  // console.log(res);
}

const createUrl = (movieTitle, apikey) => {
  return 'http://www.omdbapi.com/?t='+encodeURI(movieTitle)+'&apikey='+apikey;
}

module.exports = {
  getMovieDetails
}
