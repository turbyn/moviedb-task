require('../models/Movie');

const mongoose = require('mongoose');
const db = mongoose.connection;

const {mongoURI} = require('../config/config.json');

console.log('mongoURI');
console.log(mongoURI);

mongoose.connect(mongoURI);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Running')
});

const Movie = mongoose.model('movies');

const getMovie = (movieTitle) => {
  //get mongodb here
}

const getAllMovies = () => {

}

module.exports = {
  getMovie,
  getAllMovies
}
