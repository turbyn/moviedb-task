const {getMovieDetails} = require('./apiHandler.js');

const getMovies = (req, res) => {
  //console.log(req);
  console.log(getMovieDetails('Monty python and holy grail'))
}

const getComments = (req, res) => {
  console.log(req);
}

const postMovies = (req, res) => {
  console.log(req);
}

const postComments = (req, res) => {
  console.log(req);
}

module.exports = {
  getMovies,
  getComments,
  postMovies,
  postComments
}
