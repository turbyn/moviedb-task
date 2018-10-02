const mongoose = require('mongoose');

const { Schema } = mongoose;

const movieSchema = new Schema({
  data: Object,
  timestamp: Number
});

mongoose.model('movies', movieSchema);
