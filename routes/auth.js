const express=require('express');
const authRouter=express.Router();



const {getLogIn,postLogIn,getSignUp,postSignUp,getLogOut}=require('../controllers/authController');
authRouter.get('/login',getLogIn);
authRouter.post('/login',postLogIn);

authRouter.get('/signup',getSignUp);
authRouter.post('/signup',postSignUp);
authRouter.get('/logout',getLogOut);






module.exports=authRouter;