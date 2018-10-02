const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  commentContent: String,
  timestamp: Number,
  imdbID: String
});

mongoose.model('comments', commentSchema);
