const queryString = require('querystring');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const createUrl = (movieTitle, apikey) => `http://www.omdbapi.com/?t=${encodeURI(movieTitle)}&apikey=${apikey}`;

const parseQueryString = request => new Promise((resolve, reject) => {
  try {
    const parsedQueryStringObject = queryString.parse(request.url.split('?')[1]);
    return resolve(parsedQueryStringObject);
  } catch (e) {
    return reject(e);
  }
});


const processQueries = (parsedQueryObject, result) => {
  const queryObject = parsedQueryObject;

  return result
    .filter((movie) => {
      const isAvailable = movie.data.Released !== 'N/A';
      const queryMin = queryObject['r_day-min'];
      const queryMax = queryObject['r_day-max'];
      if (isAvailable || (queryMin || queryMax)) {
        const movieReleaseDate = moment(movie.data.Released, 'DD MMM YYYY').valueOf() / 1000;
        let releaseDayMin = -1893456000;
        let releaseDayMax = 2145744000;

        const incomingDayMin = parseInt(queryObject['r_day-min'], 10);
        const incomingDayMax = parseInt(queryObject['r_day-max'], 10);

        if (!isNaN(incomingDayMin)) {
          releaseDayMin = incomingDayMin;
        }
        if (!isNaN(incomingDayMax)) {
          releaseDayMax = incomingDayMax;
        }
        // eslint-disable-next-line
        return !isNaN(movieReleaseDate) && movieReleaseDate >= releaseDayMin && movieReleaseDate <= releaseDayMax;
      }
      return true;
    }).filter((movie) => {
      const queryMin = queryObject['runtime-min'];
      const queryMax = queryObject['runtime-max'];

      const isAvailable = movie.data.Runtime !== 'N/A';
      if (isAvailable || (queryMin || queryMax)) {
        const movieRuntime = parseInt(movie.data.Runtime.split(' ')[0], 10);
        let runtimeMin = 0;
        let runtimeMax = 60000;

        const incomingRuntimeMin = parseInt(queryObject['runtime-min'], 10);
        const incomingRuntimeMax = parseInt(queryObject['runtime-max'], 10);

        if (!isNaN(incomingRuntimeMin)) {
          runtimeMin = incomingRuntimeMin;
        }
        if (!isNaN(incomingRuntimeMax)) {
          runtimeMax = incomingRuntimeMax;
        }

        return !isNaN(movieRuntime) && movieRuntime >= runtimeMin && movieRuntime <= runtimeMax;
      }
      return true;
    }).filter((movie) => {
      const queryMin = queryObject['imdb-min'];
      const queryMax = queryObject['imdb-max'];

      const isAvailable = movie.data.imdbRating !== 'N/A';
      if (isAvailable || (queryMin || queryMax)) {
        const movieScore = parseFloat(movie.data.imdbRating);
        let scoreMin = 0;
        let scoreMax = 10.0;

        const incomingScoreMin = parseFloat(queryObject['imdb-min']);
        const incomingScoreMax = parseFloat(queryObject['imdb-max']);

        if (!isNaN(incomingScoreMin)) {
          scoreMin = incomingScoreMin;
        }
        if (!isNaN(incomingScoreMax)) {
          scoreMax = incomingScoreMax;
        }

        return !isNaN(movieScore) && movieScore >= scoreMin && movieScore <= scoreMax;
      }
      return true;
    });
};
// eslint-disable-next-line
const getConfigPathForEnv = () => {
  const env = process.env.NODE_ENV;
  if (env === 'production') {
    return '../config/config.prod.js';
  } if (env === 'development') {
    return '../config/config.dev.js';
  }
};

const checkRequiredVariableForDevEnv = (variable, name) => {
  if (!variable) {
    console.log(`${name} is required, please fill /src/config/config.dev.js - check readme for details`);
  }
};

const createConfigFile = () => {
  // eslint-disable-next-line
  const pathToDevConfig = path.join(`${__dirname}/../` + 'config/' + 'config.dev.js');
  const content = 'module.exports = {"mongoURI":"","apikey":""}';

  if (!fs.existsSync(pathToDevConfig) && process.env.NODE_ENV === 'development') {
    console.log('Config file does not exist');
    fs.writeFileSync(pathToDevConfig, content, (err) => {
      if (err) throw err;
      console.log('Dev config file created successfully, please enter credentials in /src/config/config.dev.js');
      process.exit();
    });
  }
};
/*
available queries:
r_day-min
r_day-max
runtime-min
runtime-max
imdb-min
imdb-max

sort=r_day/runtime/imdb
order=desc/asc
*/

module.exports = {
  createUrl,
  parseQueryString,
  processQueries,
  getConfigPathForEnv,
  checkRequiredVariableForDevEnv,
  createConfigFile,
};
