const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const {getMovies, getComments, postMovie, postComments} = require('./services/routes');

app.use(bodyParser.json());

app.get('/movies', getMovies);

app.get('/comments', getComments);

app.post('/movies', postMovie);

app.post('/comments', postComments);

app.listen(3000, () => {

})
