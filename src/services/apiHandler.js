const request = require('request');
const {apikey} = require('../config/config.json');

const getMovieDetails = (movieTitle) => {
  return new Promise((resolve, reject) => {
    request(createUrl(movieTitle,apikey), (err, res, body) => {
      if(err){return reject(err);}
      try {
        const parsedApiResponse = JSON.parse(body);
        if(parsedApiResponse.Response === "False"){return reject(parsedApiResponse.Error)}
        return resolve(parsedApiResponse)
      } catch (e) {
        return reject('Unable to parse API response');
      }
    })
  })
}

// IDEA: Check for duplicates using movie id from api

const createUrl = (movieTitle, apikey) => {
  return 'http://www.omdbapi.com/?t='+encodeURI(movieTitle)+'&apikey='+apikey;
}

module.exports = {
  getMovieDetails
}
