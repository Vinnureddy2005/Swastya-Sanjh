// const mongoose = require('mongoose');
// const { type } = require('os');
// const { fileURLToPath } = require('url');
// const registerwardSchema = new mongoose.Schema({
   
    
//         wardName:{type:String,required:true},
//         wardAge:{type:String,required:true},
//         wardGender:{type:String,required:true},
//         wardContactNumber:{type:String,required:true},
//         GuardianName:{type:String,required:true},
//         relation:{type:String,required:true},
//         GuardianContact:{type:String,required:true},
//         address:{type:String,required:true},
//         GuardianEmail:{type:String,required:true},
//         GuardianAge:{type:String,required:true},
//         GuardianGender:{type:String,required:true},
//         CaretakerName:{type:String,required:true},
//         CaretakerContact:{type:String,required:true},
//         CaretakerEmail:{type:String,required:true},
//         CaretakerAge:{type:String,required:true},
//         CaretakerGender:{type:String,required:true},
//         profilePicture: {
//                 "type": "object",
//                 required: true,
//                 "properties": {
//                   "profilePicture": {
//                     "type": "string",
//                     "format": "base64"
//                   }
//                 }
//               },
//         ward_idproof: {
//                 "type": "object",
//                 "properties": {
//                   "profilePicture": {
//                     "type": "string",
//                     "format": "base64"
//                   }
//                 }
//               },
//         guardian_idproof: {
//                 "type": "object",
//                 "properties": {
//                   "profilePicture": {
//                     "type": "string",
//                     "format": "base64"
//                   }
//                 }
//               },            
      
// },{collection:'RegisterWard'}
// );
// const registerward=mongoose.model('registerward',registerwardSchema);
// module.exports=registerward;





const mongoose = require('mongoose');
const { type } = require('os');
const { fileURLToPath } = require('url');
const registerwardSchema = new mongoose.Schema({
   
  wardId: { type: String, required: true, unique: true }, 
        wardName:{type:String,required:true},
        wardAge:{type:String,required:true},
        wardGender:{type:String,required:true},
        wardContactNumber:{type:String,required:true},
        
        GuardianName:{type:String,required:true},
        relation:{type:String,required:true},
        GuardianContact:{type:String,required:true},
        address:{type:String,required:true},
        GuardianEmail:{type:String,required:true},
        GuardianAge:{type:String,required:true},
        GuardianGender:{type:String,required:true},
        CaretakerName:{type:String,required:true},
        CaretakerContact:{type:String,required:true},
        CaretakerEmail:{type:String,required:true},
        CaretakerAge:{type:String,required:true},

        CaretakerGender:{type:String,required:true},
        Homename:{type:String,required:true},
      
        profilePicture: {
                "type": "object",
                required: true,
                "properties": {
                  "profilePicture": {
                    "type": "string",
                    "format": "base64"
                  }
                }
              },
        ward_idproof: {
                "type": "object",
                "properties": {
                  "profilePicture": {
                    "type": "string",
                    "format": "base64"
                  }
                }
              },
        guardian_idproof: {
                "type": "object",
                "properties": {
                  "profilePicture": {
                    "type": "string",
                    "format": "base64"
                  }
                }
              },            
      
},{collection:'RegisterWard'}
);
const registerward=mongoose.model('registerward',registerwardSchema);
module.exports=registerward;