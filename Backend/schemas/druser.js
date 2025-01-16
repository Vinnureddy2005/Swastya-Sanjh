const mongoose = require('mongoose');
const drSchema = new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
        specialization:{type:String,required:true},
        licence_id:{type:String,required:true},
        hospital:{type:String,required:true},
        password:{type:String,required:true},
        confirm_password:{type:String,required:true},
},{collection:'Doctors'}
);
const druser=mongoose.model('druser',drSchema);
module.exports=druser;