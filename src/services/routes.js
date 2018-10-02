const apiHandler = require('./apiHandler.js');
const dbHandler = require('./dbHandler.js');


const getMovies = async (req, res) => {
  console.log(req);
  // console.log();
}

const getComments = async (req, res) => {
  console.log(req);
}

const postMovies = async (req, res) => {
  if(!req.body.title){
    res.status(403).end('Title not specified');
  }

  apiHandler.getMovieDetails(req.body.title).then((result) => {
    console.log('Ok')
    res.status(200).end(JSON.stringify(result))
  }).catch((err) => {
    console.log('Err')
    res.status(503).end(JSON.stringify(err))
  })


  // res.status(200).send('Ok')
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
