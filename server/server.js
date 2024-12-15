const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');
const mongoose= require('mongoose');
const app = express();
const PORT = 9999;
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const drSchema = require('./schemas/druser');
const elderSchema = require("./schemas/elduser");
const registerwardSchema=require("./schemas/registerward");
const Prescription = require('./schemas/presciption');
const File = require('./schemas/File');
const Analysis = require('./schemas/Analysis');
const caretakerSchema = require('./schemas/caretaker');
const multer = require('multer');

mongoose.connect('mongodb://localhost:27017/Healthcare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,

}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.json());


//DoctorSignup
app.post('/signup/doctor',async(req,res)=>{
  try {
     
    const { password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return res.status(400).json({ status: 'error', message: 'Password and Confirm Password do not match' });
    }
    const isEmailExists = await drSchema.exists({ email: req.body.email });

    if (isEmailExists) {
      return res.status(400).json({ status: 'error', message: 'Email already exists' });
    }

    

    await drSchema.create({
      username:req.body.username,
      email:req.body.email,
      specialization:req.body.specialization,
      licence_id:req.body.licence_id,
      hospital:req.body.hospital,
      password:req.body.password,
      confirm_password:req.body.confirm_password,
    });


     // Save the new doctor to the database
 
    res.status(200).json({message:'Signup Success'})
    console.log('Vinnesh')
  }
  catch (error){
    console.error('Signup failed!',error);
    res.status(500).json({message:'Registration Failed'})
  }
}); 


//ElderSignup
app.post('/signup/elder',async(req,res)=>{
  try {
      
    const { password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return res.status(400).json({ status: 'error', message: 'Password and Confirm Password do not match' });
    }
    const isEmailExists = await elderSchema.exists({ email: req.body.email });

    if (isEmailExists) {
      return res.status(400).json({ status: 'error', message: 'Email already exists' });
    }

    const newElder = new elderSchema({
      username:req.body.username,
      email:req.body.email,
      contact_number:req.body.contact_number,
      Address:req.body.Address,
      password:req.body.password,
      confirm_password:req.body.confirm_password,
    });
    await newElder.save(); // Save the new doctor to the database

    res.status(200).json({message:'Signup Success'})
    console.log('Vinnesh')
  }
  catch (error){
    console.error('Signup failed!',error);
    res.status(500).json({message:'Registration Failed'})
  }
});


//Login Doctor
app.post('/login/doctorlogin', async (req, res) => {
  console.log(req.body);
  console.log('Received login request:', req.body);
  try {
    const { email, password } = req.body;
    const user = await drSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    if (password !== user.password) {
      return res.status(401).json({ status: 'error', message: 'Invalid password' });
    }
    res.json({ status: 'ok', user });

  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.get('/users', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await drSchema.findOne({ email });
    if (user) {
      res.json({ name: user.username,id:user.licence_id,spec:user.specialization
         });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Login Elder

app.post('/login/elderlogin', async (req, res) => {
  console.log(req.body);
  console.log('Received login request:', req.body);
  try {
    const { email, password } = req.body;
    const user = await elderSchema.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    if (password !== user.password) {
      return res.status(401).json({ status: 'error', message: 'Invalid password' });
    }
    res.json({ status: 'ok', user });

  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});




app.post('/wardregistration', async (req, res) => {
  try {
    function generateRandomNumber() {
      return Math.floor(1000000000 + Math.random() * 900000000); 
    }
    
    


    const uniqueId = generateRandomNumber().toString();
    console.log("uniqueid",uniqueId)
    await registerwardSchema.create({
      wardId: uniqueId,
      wardName: req.body.wardName,
      wardAge: req.body.wardAge,
      wardGender: req.body.wardGender,
      wardContactNumber: req.body.wardContactNumber,
      GuardianName: req.body.GuardianName,
      relation: req.body.relation,
      GuardianContact: req.body.GuardianContact,
      address: req.body.address,
      GuardianEmail: req.body.GuardianEmail,
      GuardianAge: req.body.GuardianAge,
      GuardianGender: req.body.GuardianGender,
      CaretakerName: req.body.CaretakerName,
      CaretakerContact: req.body.CaretakerContact,
      CaretakerEmail: req.body.CaretakerEmail,
      CaretakerAge: req.body.CaretakerAge,
      CaretakerGender: req.body.CaretakerGender,
      profilePicture: req.body.profilePicture,
      ward_idproof: req.body.ward_idproof,
      guardian_idproof: req.body.guardian_idproof,
      Homename:req.body.Homename,
     
    });
  
    res.status(200).json({ message: 'Signup Success' });
    console.log('Registered ward successfully');
  } catch (error) {
    console.error('Signup failed!', error);
    res.status(500).json({ message: 'Registration Failed' });
  }
});

// app.get('/caretakers', async (req, res) => {
//   try {
//     const options = await caretakerSchema.find({}); 
//     console.log("hii",options)// Fetch all options, selecting only 'value' and 'label' fields
//     res.json(options);
//   } catch (err) {
//     console.error('Error fetching options:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });/ 

app.get('/caretakers', async (req, res) => {
  try {
    const caretakers = await caretakerSchema.find({});
    res.json(caretakers);
  } catch (err) {
    console.error('Error fetching caretakers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



app.get('/wardprofiles', async (req, res) => {
  try {
    const wardProfiles = await registerwardSchema.find({});
    const profilesWithImages = await Promise.all(wardProfiles.map(async profile => {
      const profileWithImage = profile.toJSON();
      if (profileWithImage.profilePicture) {
        const imageBuffer = Buffer.from(profile.profilePicture, 'base64');
        profileWithImage.profilePicture = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
      }
      return profileWithImage;
    }));
    res.json(profilesWithImages);
  } catch (error) {
    console.error('Error fetching ward profiles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/wardprofiles2', async (req, res) => {
  const { Homename } = req.query;

  try {
    const wardProfiles = await registerwardSchema.find({Homename});
    const profilesWithImages = await Promise.all(wardProfiles.map(async profile => {
      const profileWithImage = profile.toJSON();
      if (profileWithImage.profilePicture) {
        const imageBuffer = Buffer.from(profile.profilePicture, 'base64');
        profileWithImage.profilePicture = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
      }
      return profileWithImage;
    }));
    res.json(profilesWithImages);
  } catch (error) {
    console.error('Error fetching ward profiles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




app.get('/images/:id', async (req, res) => {
  try {
    const profileId = req.params.id;
    const profile = await registerwardSchema.findById(profileId);
    if (!profile || !profile.profilePicture) {
      return res.status(404).json({ message: 'Profile not found or no profile picture available' });
    }
    const imageDataURI = profile.profilePicture;
    // Split the data URI to get the base64-encoded image data
    const imageData = imageDataURI.split(';base64,').pop();
    const imageBuffer = Buffer.from(imageData, 'base64');
    res.set('Content-Type', 'image/jpeg'); // Set the appropriate content type
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}); 


// Serve static files (images)
app.use('/images', express.static(path.join(__dirname, 'images')));

 


app.get('/homename', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await elderSchema.findOne({ email });
    if (user) {
      res.json({ name:user.username,address:user.Address
         });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
 


const WardProfile = mongoose.model('WardProfile', {
  wardName: String,
  wardAge: Number,
  wardGender: String,
});

// Message Model
const Message = mongoose.model('Message', {
  sender: String,
  receiver: String,
  content: String,
  read: Boolean,
  date: String,
  time: String,
  
});



app.post('/messages', async (req, res) => {
  const { sender, receiver, content } = req.body;

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  try {
    const now = new Date();
    const formattedDate = formatDate(now);
    const formattedTime = formatTime(now);

    const newMessage = new Message({
      sender,
      receiver,
      content,
      read: false, // Assuming a new message is unread by default
      date: formattedDate,
      time: formattedTime,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).json({ error: 'An error occurred while posting the message' });
  }
});

// Routes
// Get ward profile by ward name
app.get('/wardprofiles', async (req, res) => {
  const { wardName } = req.query;
  try {
    const wardProfiles = await WardProfile.find({ wardName });
    res.status(200).send(wardProfiles);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get messages by recipient
app.get('/messages', async (req, res) => {
  const { recipient } = req.query;
  try {
    const messages = await Message.find({ receiver: recipient });
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.post('/prescriptions', async (req, res) => {
  const { prescriptions, fromDate, toDate, person } = req.body;
  try {
    await Prescription.insertMany(prescriptions.map(prescription => ({
      ...prescription,
      fromDate,
      toDate,
      person,
    })));
    res.status(200).send('Prescriptions saved successfully');
  } catch (error) {
    res.status(500).send('Error saving prescriptions');
  }
});


app.get('/prescriptions', async (req, res) => {
  const { wardId } = req.query;
  console.log(wardId)
  try {
    const prescriptions = await Prescription.find({ person: wardId });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).send('Error fetching prescriptions');
  }
});


app.put('/submitPrescription', async (req, res) => {
  const { id, submittedDate } = req.body;
  console.log(`Received request to update prescription with ID: ${id} to submitted date: ${submittedDate} and status to true`);
  try {
    const result = await Prescription.findByIdAndUpdate(id, { submittedDate, status: true }, { new: true });
    console.log('Update result:', result);
    res.status(200).send({ message: 'Submission date and status updated successfully', result });
  } catch (error) {
    console.error('Error updating submission date and status:', error);
    res.status(500).send({ message: 'Error updating submission date and status', error });
  }
});

app.put('/resetPrescriptionStatus', async (req, res) => {
  try {
    const { wardId } = req.body;
    await Prescription.updateMany({ person: wardId }, { status: false });
    res.json({ message: 'Prescription status reset successfully' });
  } catch (error) {
    console.error('Error resetting prescription status:', error);
    res.status(500).json({ error: 'An error occurred while resetting prescription status' });
  }
});




const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/uploadFile', upload.single('file'), async (req, res) => {
  try {
    const { originalname, mimetype, buffer } = req.file;
    const { wardId ,fileName} = req.body; // Retrieve wardId from the request body

    const newFile = new File({
      name: originalname,
      Filename: fileName,
      date: new Date(),
      fileData: buffer,
      contentType: mimetype,
      wardId 
    });
    await newFile.save();
    res.status(200).json(newFile);
  } catch (error) {
    console.error('File upload failed', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});
 
app.get('/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.set('Content-Type', file.contentType);
    res.send(file.fileData);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/files', async (req, res) => {
  try {
    const { wardId,Filename } = req.query;
    console.log("here")
    const files = await File.find({ wardId }); // Filter files by wardId
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/files/:id', async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file' });
  }
});


//general checkup
app.post('/api/analysis', async (req, res) => {
  try {
    const { wardId, data } = req.body; 

    let existingAnalysis = await Analysis.findOne({ wardId });

    if (existingAnalysis) {
      existingAnalysis = await Analysis.findOneAndUpdate(
        { wardId },
        { ...data },
        { new: true }
      );
      res.status(200).json(existingAnalysis);
    } else {
      // If no analysis data exists, create a new entry
      const analysis = new Analysis({
        ...data,
        wardId,
      });
      await analysis.save();
      res.status(201).json(analysis);
    }
  } catch (error) {
    console.error('Error saving/updating analysis data to MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/analysis/:wardId', async (req, res) => {
  try {
    const { wardId } = req.params;
    const latestAnalysis = await Analysis.findOne({ wardId }).sort({ _id: -1 });
    res.status(200).json(latestAnalysis);
  } catch (error) {
    console.error('Error fetching analysis data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




const pdfSchema = new mongoose.Schema({
  data: Buffer,
  wardId: String,
  testname: String,
  filedate: String
});
const PDF = mongoose.model('PDF', pdfSchema);
 
app.use(bodyParser.json());

// Endpoint to receive Base64 PDF and save to MongoDB
app.post('/upload-pdf', async (req, res) => {
  const { pdfBase64, wardId ,testname,filedate} = req.body;

  // Convert Base64 back to binary
  const base64Data = pdfBase64.split(';base64,').pop();
  const buffer = Buffer.from(base64Data, 'base64');

  try {
      // Save to MongoDB
      const pdf = new PDF({ data: buffer , wardId, testname,filedate});
      await pdf.save();

      res.status(200).json({ message: 'PDF saved successfully.' });
      console.log('PDF saved successfully');
  } catch (error) {
      console.error('Error saving PDF:', error);
      res.status(500).json({ error: 'Failed to save PDF.' });
  }
});

app.get('/pdfs', async (req, res) => {
  try {
    const pdfs = await PDF.find({}, 'wardId testname filedate'); // Fetch PDFs without the data field for efficiency
    res.status(200).json(pdfs);
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    res.status(500).json({ error: 'Failed to fetch PDFs.' });
  }
});


// Endpoint to fetch a single PDF by ID
app.get('/pdf/:id', async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found.' });
    }
    const base64String = pdf.data.toString('base64');
    res.status(200).json({ data: base64String });
  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).json({ error: 'Failed to fetch PDF.' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
    