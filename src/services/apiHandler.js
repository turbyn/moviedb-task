const request = require('request');

const utilities = require('./utilities.js');

// eslint-disable-next-line
const { apikey } = require(utilities.getConfigPathForEnv());
utilities.checkRequiredVariableForDevEnv(apikey, 'apikey');

const { createUrl } = require('./utilities.js');

const getMovieDetails = movieTitle => new Promise((resolve, reject) => {
  request(createUrl(movieTitle, apikey), (err, res, body) => {
    if (err) { return reject(err); }
    try {
      const parsedApiResponse = JSON.parse(body);
      const originalQueryString = movieTitle;
      if (parsedApiResponse.Response === 'False') { return reject(parsedApiResponse.Error); }
      return resolve({ parsedApiResponse, originalQueryString });
    } catch (e) { // eslint-disable-next-line
      return reject('Unable to parse API response');
    }
  });
});

module.exports = {
  getMovieDetails,
};
