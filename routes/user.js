const express=require('express');
const userRouter=express.Router();
const{Home,weatherData,aboutData,favData,favCity,removeFavCity}=require('../controllers/userController');
userRouter.get('/',Home);
userRouter.get('/getweather',weatherData);
userRouter.get('/about',aboutData);
userRouter.get('/fav',favData);
userRouter.get('/favorites',favCity);
userRouter.get('/remove-favorite',removeFavCity);

module.exports=userRouter;