const apiHandler = require('./apiHandler.js');
const dbHandler = require('./dbHandler.js');


const getMovies = async (req, res) => {

}

const getComments = async (req, res) => {
  console.log(req);
}

const postMovie = async (req, res) => {
  if(!req.body.title){
    res.status(403).end('Title not specified');
  }

  apiHandler.getMovieDetails(req.body.title)
  .then(dbHandler.addMovie)
  .then((res) => {
    res.status(200).end('ok');
  })
  .catch((err) => {
    res.status(503).end(JSON.stringify(err));
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
