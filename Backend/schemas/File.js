const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Filename: { type: String, required: true },
  date: { type: Date, default: Date.now },
  fileData: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  wardId: { type: String, required: true } ,
  
});

const File = mongoose.model('File', fileSchema);

module.exports = File;