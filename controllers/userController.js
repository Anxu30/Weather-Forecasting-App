const axios=require('axios');
const Auth=require('../models/auth');
const Home=(req,res,next)=>{
  res.render('../views/home',{obj:{id:"",
    country:"",
    city:"",
    temp:"",
    humid:""
  },login:req.session.login});
}
exports.Home=Home;
const weatherData=(req,res,next)=>{
  const key='*****894b1fd******cb7a049377dfd*******';
  const city=req.query.city;
  const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
axios.get(url).then((response)=>{
 const meta=response.data;

const kel=meta.main.temp;
const celsius=kel-273.15;
const tempe=celsius.toFixed(1);

   res.render('../views/home.ejs',{obj:{id:meta.weather[0].id,
    country:meta.sys.country,
    city:meta.name,
    temp:tempe,
    humid:meta.main.humidity,},login:req.session.login});
}).catch((err)=>{
  if(err){
    console.log(err);
  }
});

}
exports.weatherData=weatherData;
const aboutData=(req,res,next)=>{
  res.render('../views/about.ejs',{
    login:req.session.login
  });
}
exports.aboutData=aboutData;

const favData=async (req,res,next)=>{
const city=req.query.favCity;
let count=0;
const auth=await Auth.findOne({email:req.session.authMail})
for(i=0;i<auth.fav_cities.length;i++){

if(auth.fav_cities[i]==city){
  count++; 
  break;
}


}
if(!count){
await Auth.findOneAndUpdate({email:req.session.authMail},{
  $push:{
    fav_cities:city
  }
})
console.log('Added Fav_City');
return res.redirect('/');
}
if(count){
console.log('Repetition of Fav_City');
return res.redirect('/');
}

}
exports.favData=favData;


const favCity=async (req,res,next)=>{
  const array=[];
  const key='***************b1fd7351cb7a049377***********';
 const data=await Auth.findOne({email:req.session.authMail});
for(let i=0;i<data.fav_cities.length;i++){
 const favcity=data.fav_cities[i];
 const url=`https://api.openweathermap.org/data/2.5/weather?q=${favcity}&appid=${key}`;
 const citydata=await axios.get(url);
 const meta=citydata.data;
 const kel=meta.main.temp;
const celsius=kel-273.15;
const tempe=celsius.toFixed(1);
 const obj={
  id:meta.weather[0].id,
    country:meta.sys.country,
    city:meta.name,
    temp:tempe,
    humid:meta.main.humidity

 }
 array.push(obj);

}
console.log(array);
return res.render('../views/fav.ejs',{arr:array,login:req.session.login});



}
exports.favCity=favCity;

const removeFavCity = async (req, res, next) => {
  try {
    const city = req.query.city;
    const auth = await Auth.findOne({ email: req.session.authMail });
    
    if (!auth) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    await Auth.findOneAndUpdate(
      { email: req.session.authMail },
      { $pull: { fav_cities: city } }
    );

    console.log('Removed city from favorites:', city);
    return res.redirect('/favorites');
  } catch (error) {
    console.error('Error removing favorite city:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

exports.removeFavCity = removeFavCity;



