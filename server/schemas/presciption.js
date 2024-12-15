const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: String, required: true },
  restriction: { type: String, required: true },
  quantity: { type: String, required: true },
  status: { type: Boolean, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  person: { type: String, required: true },
},{collection:'Prescriptions'});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
