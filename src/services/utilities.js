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

  // return result
  // .filter((movie) => {
  //     const isAvailable = movie.data.Released !== "N/A"
  //     const queryMin = queryObject['r_day-min']
  //     const queryMax = queryObject['r_day-max']
  //     if(isAvailable || (queryMin || queryMax)){
  //     let movieReleaseDate = moment(movie.data.Released, "DD MMM YYYY").valueOf() / 1000;
  //     let releaseDayMin = 0;
  //     let releaseDayMax = 2145744000;
  //
  //     let incomingDayMin = parseInt(queryObject['r_day-min']);
  //     let incomingDayMax = parseInt(queryObject['r_day-max']);
  //
  //     if(!isNaN(incomingDayMin)) {
  //       releaseDayMin = incomingDayMin
  //     }
  //     if(!isNaN(incomingDayMax)) {
  //       releaseDayMax = incomingDayMax
  //     }
  //     // console.log('-*-*-*-*-*-*-*-*-*-*-*-*-*-*-')
  //     // console.log('Title: '+movie.data.Title);
  //     // console.log('Release day min');
  //     // console.log('Min value:'+releaseDayMin);
  //     // console.log('Max value:'+releaseDayMax);
  //     // console.log('Will pass?'+(!isNaN(movieReleaseDate) && movieReleaseDate >= releaseDayMin && movieReleaseDate <= releaseDayMax))
  //     // console.log('-*-*-*-*-*-*-*-*-*-*-*-*-*-*-')
  //     return !isNaN(movieReleaseDate) && movieReleaseDate >= releaseDayMin && movieReleaseDate <= releaseDayMax
  //   }else{
  //     return true
  //   }
  // }).filter((movie) => {
  //   const queryMin = queryObject['runtime-min']
  //   const queryMax = queryObject['runtime-max']
  //
  //   const isAvailable = movie.data.Runtime !== "N/A"
  //   if(isAvailable || (queryMin || queryMax)){
  //   let movieRuntime = parseInt(movie.data.Runtime.split(' ')[0]);
  //   let runtimeMin = 0;
  //   let runtimeMax = 60000;
  //
  //   let incomingRuntimeMin = parseInt(queryObject['runtime-min']);
  //   let incomingRuntimeMax = parseInt(queryObject['runtime-max']);
  //
  //   if(!isNaN(incomingRuntimeMin)) {
  //     runtimeMin = incomingRuntimeMin
  //   }
  //   if(!isNaN(incomingRuntimeMax)) {
  //     runtimeMax = incomingRuntimeMax
  //   }
  //   //
  //   // console.log('-*-*-*-*-*-*-*-*-*-*-*-*-*-*-')
  //   // console.log('Title: '+movie.data.Title);
  //   // console.log('Runtime');
  //   // console.log('Min value:'+runtimeMin);
  //   // console.log('Max value:'+runtimeMax);
  //   // console.log('Will pass?'+(!isNaN(movieRuntime) && movieRuntime >= runtimeMin && movieRuntime <= runtimeMax))
  //   // console.log('-*-*-*-*-*-*-*-*-*-*-*-*-*-*-')
  //
  //   return !isNaN(movieRuntime) && movieRuntime >= runtimeMin && movieRuntime <= runtimeMax;
  // }else{
  //   return true
  // }
  // }).filter((movie) => {
  //   const queryMin = queryObject['imdb-min']
  //   const queryMax = queryObject['imdb-max']
  //
  //   const isAvailable = movie.data.imdbRating !== "N/A"
  //   if(isAvailable || (queryMin || queryMax)){
  //   let movieScore = parseFloat(movie.data.imdbRating);
  //   let scoreMin = 0;
  //   let scoreMax = 10.0;
  //
  //   let incomingScoreMin = parseFloat(queryObject['imdb-min']);
  //   let incomingScoreMax = parseFloat(queryObject['imdb-max']);
  //
  //   if(!isNaN(incomingScoreMin)) {
  //     scoreMin = incomingScoreMin
  //   }
  //   if(!isNaN(incomingScoreMax)) {
  //     scoreMax = incomingScoreMax
  //   }
  //
  //   // console.log('-*-*-*-*-*-*-*-*-*-*-*-*-*-*-')
  //   // console.log('Title: '+movie.data.Title);
  //   // console.log('ImdbRating');
  //   // console.log('Min value:'+scoreMin);
  //   // console.log('Max value:'+scoreMax);
  //   // console.log('Will pass?'+(!isNaN(movieScore) && movieScore >= scoreMin && movieScore <= scoreMax))
  //   // console.log('-*-*-*-*-*-*-*-*-*-*-*-*-*-*-')
  //   return !isNaN(movieScore) && movieScore >= scoreMin && movieScore <= scoreMax;
  // }else{
  //   return true
  // }
  // })
  // return result

  return result
  .filter((movie) => {
    return checkRangeForProperty(movie,0,2145744000,'r_day-',queryObject,'Released','int')
  })
  .filter((movie) => {
    return checkRangeForProperty(movie,0,60000,'runtime-',queryObject,'Runtime','int')
  })
  .filter((movie) => {
    return checkRangeForProperty(movie,0.0,10.0,'imdb-',queryObject,'imdbRating','float')
  })

}

const checkRangeForProperty = (movie,propertyMinValue,propertyMaxValue,propertyQueryPath,queryObject,propertyObjectPath,variableType) => {


  const queryMin = queryObject[propertyQueryPath+'min']
  const queryMax = queryObject[propertyQueryPath+'max']

  const isAvailable = movie.data[propertyObjectPath] !== "N/A"
  if(isAvailable || (queryMin || queryMax)){

  // let movieProperty = parseFloat(movie.data[propertyObjectPath]);
  let propertyMin = propertyMinValue;
  let propertyMax = propertyMaxValue;

  // var movieProperty;
  if(variableType === "int"){
    var movieProperty = parseInt(movie.data[propertyObjectPath]);
    var incomingPropertyMin = parseInt(queryObject[propertyQueryPath+'min']);
    var incomingPropertyMax = parseInt(queryObject[propertyQueryPath+'max']);
  }else if(variableType === "float"){
    var movieProperty = parseFloat(movie.data[propertyObjectPath]);
    var incomingPropertyMin = parseFloat(queryObject[propertyQueryPath+'min']);
    var incomingPropertyMax = parseFloat(queryObject[propertyQueryPath+'max']);
  }
  if(!isNaN(incomingPropertyMin)) {
    propertyMin = incomingPropertyMin
  }
  if(!isNaN(incomingPropertyMax)) {
    propertyMax = incomingPropertyMax
  }

  return !isNaN(movieProperty) && movieProperty >= propertyMin && movieProperty <= propertyMax;
}else{
  return true
}




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
