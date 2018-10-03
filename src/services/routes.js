const apiHandler = require('./apiHandler.js');
const dbHandler = require('./dbHandler.js');


const getMovies = async (req, res) => {
  dbHandler.getAllMovies().then((result) => {
    res.status(200).send(result)
  }).catch((e) => {
    res.status(403).send(e);
  })
}

const getComments = async (req, res) => {
  dbHandler.getAllComments().then((result) => {
    res.status(200).send(result)
  }).catch((e) => {
    res.status(403).send(e);
  })
}

const postMovie = async (req, res) => {
  if(!req.body.title){
    return res.status(403).send('Title not specified');
  }

  apiHandler.getMovieDetails(req.body.title)
  .then(dbHandler.preventMultiple)
  .then(dbHandler.addMovie)
  .then((objectResult) => {
    res.status(200).send(objectResult);
  })
  .catch((err) => {
    if(err.data) {
      return res.status(200).send(err.data)
    }
    res.status(503).send(JSON.stringify(err));
  })

}

const postComment = (req, res) => {
  const {content, movieId} = req.body
  if(!content || !movieId) return res.status(401).send("Content or movieID not provided");

  dbHandler.verifyMovieOccurenceInDb(req.body.content, req.body.movieId)
  .then(dbHandler.addComment)
  .then((objectResult) => {
    res.status(200).send(objectResult)
  })
  .catch((err) => {
    res.status(503).send(JSON.stringify(err))
  })
}

module.exports = {
  getMovies,
  getComments,
  postMovie,
  postComment
}
