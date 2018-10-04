const mongoose = require('mongoose');

const { Schema } = mongoose;

const movieSchema = new Schema({
  data: Object,
  timestamp: Number,
  queryTitle: String
});

const Movie = mongoose.model('movies', movieSchema);

module.exports = {Movie}
