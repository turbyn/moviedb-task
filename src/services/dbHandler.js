require('../models/Movie');
require('../models/Comment');

const mongoose = require('mongoose');
const db = mongoose.connection;

const {mongoURI} = require('../config/config.json');

mongoose.connect(mongoURI);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Running')
});

const Movie = mongoose.model('movies');
const Comment = mongoose.model('comments');

const getMovie = (movieTitle, id) => {
  //get mongodb here
}

const getAllMovies = (parsedQueryObject) => {
  return new Promise((resolve, reject) => {
    console.log('PARSED QUERY OBJECT IN GET ALL MOVIES');
    console.log(parsedQueryObject);
    Movie.find({}, function(err,result){
      if(err) return reject(err)
      return resolve(result);
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
    const savedMovie = new Movie({ data: data, timestamp: new Date()})
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
    Movie.find({ "data.imdbID": movieId}, function(err,result){
      if(err) return reject(err)
      if(result.length === 0) return reject('Movie not found in db');
      return resolve({comment,movieId})
    })
  })
}

const preventMultiple = (dataObject) => {
  console.log('Already existing running')
  return new Promise((resolve, reject) => {
    Movie.find({ "data.imdbID": dataObject.imdbID}, function(err,result){
      if(err) return reject(err)
      if(result.length > 0){return reject({err: "Movie already existing", data: dataObject})}
      return resolve(dataObject)
    })
  })
}



module.exports = {
  getMovie,
  getAllMovies,
  getAllComments,
  addMovie,
  addComment,
  verifyMovieOccurenceInDb,
  preventMultiple
}
