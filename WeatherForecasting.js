const express=require('express');
const session=require('express-session');
const mongoose =require("mongoose");
const mongoDB=require('connect-mongodb-session')(session);
const user=require('./routes/user');
const auth=require('./routes/auth');

const DB_Path="mongodb+srv://root:Qwertyz%40123@anujchaudhary.ymavmtv.mongodb.net/WeatherForecast?retryWrites=true&w=majority&appName=AnujChaudhary";

const port=1012;
const app=express();
app.set('view engine','ejs');
app.set('views','views');
app.use(express.urlencoded());
const store=new mongoDB({
  uri: DB_Path,
  collection:'sessions'
  })

app.use(session({
  secret:"AnujChaudhary",
  resave:false,
  saveUninitialized:true,
  store:store
}))

app.use((req,res,next)=>{
  console.log(req.session);
  next();
})
app.use(auth);
app.use(user);



mongoose.connect(DB_Path).then(()=>{
  app.listen(port,()=>{
    console.log(`Server started at http://localhost:${port}`);
  })
}).catch((err)=>{
  console.log(err);
})




