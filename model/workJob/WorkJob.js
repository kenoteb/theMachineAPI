var mongoose = require('mongoose');

var workJobSchema = new mongoose.Schema({
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: false
  }],
  jobName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tasks: [{
    type: String
  }],
  dateCreated: {
    type: Date,
    default: Date.now
  },
  time: {
    type: String,
    required: true
  },
  days: {
    type: Array,
    required: true
  }
});
mongoose.model('WorkJob', workJobSchema);

module.exports = mongoose.model('WorkJob');
