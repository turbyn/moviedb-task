const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  content: String,
  timestamp: Number,
  imdbID: String
});

const Comment = mongoose.model('comments', commentSchema);

module.exports = {Comment}
