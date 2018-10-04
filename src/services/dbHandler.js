require('../models/Movie');
require('../models/Comment');

const mongoose = require('mongoose');

const db = mongoose.connection;

const utilities = require('./utilities.js');
// eslint-disable-next-line
const { mongoURI } = require(utilities.getConfigPathForEnv());
utilities.checkRequiredVariableForDevEnv(mongoURI, 'mongoURI');

mongoose.connect(mongoURI, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Running');
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

const getAllMovies = parsedQueryObject => new Promise((resolve, reject) => {
  console.log(parsedQueryObject);
  Movie.find({}, (err, result) => {
    if (err) return reject(err);
    return resolve(utilities.processQueries(parsedQueryObject, result));
  });
});

const getAllComments = parsedQueryObject => new Promise((resolve, reject) => {
  let mongoQueryObject = {};
  if (parsedQueryObject.id) { mongoQueryObject = { imdbID: parsedQueryObject.id }; }
  Comment.find(mongoQueryObject, (err, result) => {
    if (err) return reject(err);
    return resolve(result);
  });
});

const addMovie = data => new Promise((resolve, reject) => {
  const savedMovie = new Movie({
    data: data.parsedApiResponse,
    timestamp: new Date(),
    queryTitle: data.originalQueryString,
  });
  savedMovie.save((err) => {
    if (err) { return reject(err); }
    return resolve(savedMovie);
  });
});

const addComment = objectReceived => new Promise((resolve, reject) => {
  const { comment, movieId } = objectReceived;
  const savedComment = new Comment({ content: comment, imdbID: movieId, timestamp: new Date() });
  savedComment.save((err) => {
    if (err) { return reject(err); }
    return resolve(savedComment);
  });
});

const verifyMovieOccurenceInDb = (comment, movieId) => new Promise((resolve, reject) => {
  Movie.find({ 'data.imdbID': movieId }, (err, result) => {
    if (err) return reject(err);// eslint-disable-next-line
    if (result.length === 0) return reject('Movie not found in db');
    return resolve({ comment, movieId });
  });
});

const preventMultiple = dataObject => new Promise((resolve, reject) => {
  Movie.find({ 'data.imdbID': dataObject.parsedApiResponse.imdbID }, (err, result) => {
    console.log('Result');
    console.log(result);
    if (err) return reject(err);// eslint-disable-next-line
    if (result.length > 0) { return reject({ err: 'Movie already existing', data: dataObject }); }
    return resolve(dataObject);
  });
});


module.exports = {
  getAllMovies,
  getAllComments,
  addMovie,
  addComment,
  verifyMovieOccurenceInDb,
  preventMultiple,
};
