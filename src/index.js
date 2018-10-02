const express = require('express');
const app = express();

const {getMovies, getComments, postMovies, postComments} = require('./services/routes');

app.get('/movies', getMovies);

app.get('/comments', getComments);

app.post('/movies', postMovies);

app.post('/comments', postComments);

app.listen(3000, () => {

})
