const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  content: String,
  timestamp: Number,
  imdbID: String
});

mongoose.model('comments', commentSchema);
