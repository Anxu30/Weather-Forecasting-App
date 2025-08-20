const mongoose=require('mongoose');
const authSchema=mongoose.Schema({
  username:{
    type:String,
    required:true
},
email:{
  type:String,
  required:true,
  unique:true
},
password:{
  type:String,
  required:true,
},
fav_cities:[{
  type:String,
  default:[]
}]
})
module.exports=mongoose.model('Auth',authSchema);