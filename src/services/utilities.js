const queryString = require('querystring');
const moment = require('moment');

const createUrl = (movieTitle, apikey) => {
  return 'http://www.omdbapi.com/?t='+encodeURI(movieTitle)+'&apikey='+apikey;
}

const parseQueryString = (request) => {
  return new Promise((resolve, reject) => {
    try {
      const parsedQueryStringObject = queryString.parse(request.url.split('?')[1]);
      return resolve(parsedQueryStringObject)
    } catch (e) {
      return reject(e)
    }
  })
}

const processQueries = (parsedQueryObject, result) => {
  console.log('Processing queries with parsedQueryObject');
  console.log(parsedQueryObject);
  console.log('Received from db:')
  console.log(result);

  let queryObject = parsedQueryObject;

  // const defaultValues = {
  //   "r_day-min": 0,
  //   "r_day-max": 2145744000,
  //   "runtime-min": 0,
  //   "runtime-max": 6000,
  //   "imdb-min": 0.0,
  //   "imdb-max": 10.0
  // }
  //
  // const defaultSort = {
  //   "attribute": "r_day",
  //   "order": "asc"
  // }

  // const filteredArray = result.filter((movie) => {
  //   return movie.data.
  // })

  return result.filter((movie) => {
      const isAvailable = movie.data.Released !== "N/A"
      if(isAvailable){
      let movieReleaseDate = moment(movie.data.Released, "DD MMM YYYY").valueOf() / 1000;
      let releaseDayMin = 0;
      let releaseDayMax = 2145744000;

      let incomingDayMin = parseInt(queryObject['r_day-min']);
      let incomingDayMax = parseInt(queryObject['r_day-max']);

      if(!isNaN(incomingDayMin)) {
        releaseDayMin = incomingDayMin
      }
      if(!isNaN(incomingDayMax)) {
        releaseDayMax = incomingDayMax
      }

      return movieReleaseDate > releaseDayMin && movieReleaseDate < releaseDayMax
      }
  })

  //   console.log(moment(movie.data.Released, "DD MMM YYYY"));
  //   console.log(moment(parseInt(parsedQueryObject['r_day-min'])))
  // })



  return result
}

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
  processQueries
}
