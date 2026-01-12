const mongoose = require('mongoose');

const placementEventSchema = new mongoose.Schema({
  eventDate: {
    type: Date,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  rounds: {
    type: Number,
    default: 1,
  },
  roundTypes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PlacementEvent', placementEventSchema);
