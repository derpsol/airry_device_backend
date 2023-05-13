const mongoose = require('mongoose');

const BettingSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    require: true,
  },
  aqi: {
    type: Number,
    require: true,
  },
  pm25: {
    type: Number,
    require: true,
  },
  pm10: {
    type: Number,
    require: true,
  },
  voc: {
    type: Number,
    require: true,
  },
  humidity: {
    type: Number,
    require: true,
  },
  temperature: {
    type: Number,
    require: true,
  },
  status: {
    type: Boolean,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Betting', BettingSchema);
