const mongoose=require("mongoose");
const passport=require("passport");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    
});

userSchema.plugin(passportLocalMongoose); // this is for that we can use the passport local mongoose package
module.exports = mongoose.model('User', userSchema);