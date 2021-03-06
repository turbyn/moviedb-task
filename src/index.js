// eslint-disable-next-line
const utilities = require('./services/utilities');
utilities.createConfigFile();

const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const {
  getMovies, getComments, postMovie, postComment,
} = require('./services/routes');


app.use(bodyParser.json());

app.get('/movies', getMovies);

app.get('/comments', getComments);

app.post('/movies', postMovie);

app.post('/comments', postComment);

app.listen(process.env.PORT || 3000, () => {});

module.exports = { app };
