const {check,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const Auth=require('../models/auth');

const getLogIn=(req,res,next)=>{
  res.render('../views/login',{login:false})
}
exports.getLogIn=getLogIn;


const postLogIn=async (req,res,next)=>{
  const {email,password}=req.body;

const data=await Auth.findOne({email:email});
if(data){
  req.session.authMail=data.email;
  const meta=await bcrypt.compare(password,data.password);
  if(meta){
    req.session.login=true;
    return res.redirect('/');
  }
  else{
console.log('Incorrect User Credentials');
return res.render('../views/login.ejs',{login:false});
  }
}
else{
  console.log('Incorrect User Credentials');
return res.render('../views/login.ejs',{login:false});
}
  
}
exports.postLogIn=postLogIn; 


const getLogOut=(req,res,next)=>{
  req.session.destroy(()=>{
    res.redirect('/login');
  });
  
}
exports.getLogOut= getLogOut;

const getSignUp=(req,res,next)=>{
  res.render('../views/signup',{obj:{
    username:"",
    email:"",
    password:""},err:[],login:false});
}
exports.getSignUp= getSignUp;


const postSignUp=[

check('username').notEmpty().withMessage('Name Field Must Not be Empty').trim().isLength({min:2}).withMessage('Name Length Error').matches(/^[a-zA-Z\s]+$/).withMessage('Invalid UserName'),
check('email').isEmail().withMessage('Invalid Email').normalizeEmail({gmail_remove_dots: false}),
check('password').trim()
.isLength({ min: 8 })
.withMessage("Password length must be min: 8")
.matches(/[a-z]/)
.withMessage("Password must contain small letters")
.matches(/[A-Z]/)
.withMessage("Password must contain Capital letters")
.matches(/[0-9]/)
.withMessage("Password must contain digits")
.matches(/[#,$,@]/)
.withMessage("Password must contain special characters"),
check('confirmpassword').custom((value,{req})=>{
if(value!==req.body.password){
  throw new Error('Passwords do not match');
  
}
return true;
})
,

async (req,res,next)=>{

  const{username,email,password}=req.body;

  const error=validationResult(req);
  if(!error.isEmpty())
    {
    const err=error.array().map(h=>{
      return h.msg;
    })
    err.forEach(h=>{
      console.log(h);
    })
   return res.render('../views/signup.ejs',{
err:err,obj:{username,email,password},login:false
    })
  }

  else{
const data=await Auth.findOne({email:email});
if(!data){
 bcrypt.hash(password,12).then(async (data)=>{
  const auth=new Auth({
    username:req.body.username,
    email:req.body.email,
    password:data

  })
  const authData=await auth.save();
  return res.redirect('/login');

 }).catch((err)=>{
  if(err){
    console.log(err);
    res.render('../views/signup.ejs',{
      login:false,
      err:[],
      obj:{
        username:"",
        email:"",
        password:""
      }
    ,login:false})
  }
 })
 
}

else{
console.log("email is already registered, try with a new one");
res.redirect('/signup');
}




  }
}
  
]
exports.postSignUp= postSignUp;

