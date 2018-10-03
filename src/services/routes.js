const apiHandler = require('./apiHandler.js');
const dbHandler = require('./dbHandler.js');


const getMovies = async (req, res) => {

}

const getComments = async (req, res) => {
  console.log(req);
}

const postMovie = async (req, res) => {
  if(!req.body.title){
    return res.status(403).send('Title not specified');
  }

  // apiHandler.getMovieDetails(req.body.title)
  // .then(dbHandler.addMovie)
  // .then((objectResult) => {
  //   res.status(200).send(objectResult);
  // })
  // .catch((err) => {
  //   res.status(503).send(JSON.stringify(err));
  // })

  apiHandler.getMovieDetails(req.body.title)
  .then(dbHandler.addMovie)
  .then((objectResult) => {
    res.status(200).send(objectResult);
  })
  .catch((err) => {
    res.status(503).send(JSON.stringify(err));
  })

}

const postComments = (req, res) => {
  console.log(req);
}

module.exports = {
  getMovies,
  getComments,
  postMovie,
  postComments
}
