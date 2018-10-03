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

const getAllMovies = () => {

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

const addComment = (content, movieId) => {
  return new Promise((resolve, reject) => {
    resolve('Done');  // TODO: Finish adding comments with checking if movie of Id exists in DB
  })
}

module.exports = {
  getMovie,
  getAllMovies,
  addMovie
}
