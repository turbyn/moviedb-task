require('../models/Movie');
require('../models/Comment');

const mongoose = require('mongoose');
const db = mongoose.connection;

const {mongoURI} = require('../config/config.json');

const utilities = require('./utilities.js');

mongoose.connect(mongoURI, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Running')
});

const Movie = mongoose.model('movies');
const Comment = mongoose.model('comments');

/*
available queries:
r_day-s
r_day-e
runtime-s
runtime-e
imdb-s
imdb-e
*/

const getAllMovies = (parsedQueryObject) => {
  return new Promise((resolve, reject) => {
    console.log(parsedQueryObject);
    Movie.find({}, function(err,result){
      if(err) return reject(err)
      return resolve(utilities.processQueries(parsedQueryObject, result));
    })
  })
}

const getAllComments = (parsedQueryObject) => {
  return new Promise((resolve, reject) => {
    let mongoQueryObject = {};
    if(parsedQueryObject.id) {mongoQueryObject = {"imdbID" : parsedQueryObject.id}};
    Comment.find(mongoQueryObject, function(err,result){
      if(err) return reject(err)
      return resolve(result);
    })
  })
}

const addMovie = (data) => {
  return new Promise((resolve, reject) => {
    const savedMovie = new Movie({ data: data['parsedApiResponse'], timestamp: new Date(), queryTitle: data['originalQueryString']})
    savedMovie.save((err) => {
      if(err){return reject(err)};
      return resolve(savedMovie);
    })
  })
}

const addComment = (objectReceived) => {
  return new Promise((resolve, reject) => {
    const {comment, movieId} = objectReceived;
    const savedComment = new Comment({ content: comment, imdbID: movieId, timestamp: new Date()});
    savedComment.save((err) => {
      if(err){return reject(err)};
      return resolve(savedComment)
    })
  })
}

const verifyMovieOccurenceInDb = (comment, movieId, calledIn) => {
  return new Promise((resolve, reject) => {
    Movie.find({ "data.imdbID":movieId}, function(err,result){
      if(err) return reject(err)
      if(result.length === 0) return reject('Movie not found in db');
      return resolve({comment,movieId})
    })
  })
}

const preventMultiple = (dataObject) => {
  // console.log('Already existing running')
  // console.log('Data object');
  // console.log(dataObject)
  return new Promise((resolve, reject) => {
    Movie.find({ "data.imdbID": dataObject.parsedApiResponse.imdbID}, function(err,result){
      console.log('Result');
      console.log(result)
      if(err) return reject(err)
      if(result.length > 0){return reject({err: "Movie already existing", data: dataObject})}
      return resolve(dataObject)
    })
  })
}



module.exports = {
  getAllMovies,
  getAllComments,
  addMovie,
  addComment,
  verifyMovieOccurenceInDb,
  preventMultiple
}
