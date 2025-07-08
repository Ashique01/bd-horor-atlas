const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  division: { type: String }, // optional
  district: { type: String, required: true },
  source: String,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  isAdminApproved: {
    type: Boolean,
    default: false,
  },
  isRejected: {
  type: Boolean,
  default: false,
},
});

module.exports = mongoose.model('Story', StorySchema);
