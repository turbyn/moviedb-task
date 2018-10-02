const mongoose = require('mongoose');

const { Schema } = mongoose;

const movieSchema = new Schema({
  data: Object
});

mongoose.model('movies', movieSchema);
