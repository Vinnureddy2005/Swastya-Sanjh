
const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  height: { type: String, required: true },
  weight: { type: String, required: true },
  bp_systolic: { type: String, required: true },
  bp_diastolic: { type: String, required: true },
  pulse_rate: { type: String, required: true },
  temperature: { type: String, required: true },
  wardId: { type: String, required: true },
  results: { type: Object, required: true }
});

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;
