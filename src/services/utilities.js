const queryString = require('querystring');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

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

const getConfigPathForEnv = () => {
  let env = process.env.NODE_ENV
  if(env === 'production'){
    return '../config/config.prod.js'
  }else if(env === 'development'){
    return '../config/config.dev.js'
  }
}

const checkRequiredVariableForDevEnv = (variable, name) => {
  if(!variable){
    console.log(`${name} is required, please fill /src/config/config.dev.js - check readme for details`);
  }
}

const createConfigFile = () => {
    const pathToDevConfig = path.join(__dirname + '/../' + 'config/' + 'config.dev.js');
    const content = 'module.exports = {"mongoURI":"","apikey":""}';

    if (!fs.existsSync(pathToDevConfig) && process.env.NODE_ENV === 'development') {
      console.log('Config file does not exist')
      fs.writeFileSync(pathToDevConfig, content, function (err) {
        if (err) throw err;
        console.log('Dev config file created successfully, please enter credentials in /src/config/config.dev.js');
        process.exit()
      });
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
  processQueries,
  getConfigPathForEnv,
  checkRequiredVariableForDevEnv,
  createConfigFile
}
