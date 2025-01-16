// models/Caretaker.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
  
// Define the Caretaker schema
const caretakerSchema = new Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  e_email: { type: String, required: true }
});

// Create a model based on the schema
const Caretaker = mongoose.model('Caretaker', caretakerSchema);

module.exports = Caretaker;
