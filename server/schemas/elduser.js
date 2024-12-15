const mongoose = require('mongoose');
const elderSchema = new mongoose.Schema({
    username:{type:String,required:true},
        email:{type:String,required:true},
        contact_number:{type:String,required:true},
        Address:{type:String,required:true},
        password:{type:String,required:true},
        confirm_password:{type:String,required:true},
},{collection:'Elders'}
);
const elduser=mongoose.model('elduser',elderSchema);
module.exports=elduser;