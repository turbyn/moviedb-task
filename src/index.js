const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const {getMovies, getComments, postMovie, postComment} = require('./services/routes');

app.use(bodyParser.json());

app.get('/movies', getMovies);

app.get('/comments', getComments);

app.post('/movies', postMovie);

app.post('/comments', postComment);

app.listen(3000, () => {

})
