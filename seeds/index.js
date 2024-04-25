const mongoose = require('mongoose')
const db = mongoose.connection;
const Campground = require('../model/campground')
const {descriptors, places} = require('./seedHelper')
const cities = require('./cities')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

db.on("error",console.error.bind(console,"connection error:"))
db.once("open", ()=>{
    console.log('Database Connected');
})

const sample = array=>array[Math.floor(Math.random()*array.length)]

const seedDb = async()=>{
    await Campground.deleteMany({})
    for(let i=0; i<500; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10
        const camp = new Campground({
            location:`${cities[random1000].city} ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image: [
                  {
                    url: 'https://res.cloudinary.com/dduiomi6y/image/upload/v1713278936/YelpCamp/qju8ixc2kr4xaen2sdia.jpg', 
                    filename: 'YelpCamp/qju8ixc2kr4xaen2sdia'
                  },
                  {
                    url: 'https://res.cloudinary.com/dduiomi6y/image/upload/v1713278936/YelpCamp/icwpl2ecxtzehfcil1ky.jpg', 
                    filename: 'YelpCamp/icwpl2ecxtzehfcil1ky'
                  },
            ],
            geometry: { 
              type: 'Point', 
              coordinates: [cities[random1000].longitude,cities[random1000].latitude] 
            },
            description:'No matter what your group happens to be brainstorming, interjecting random images can be a wonderful way to expand the brainstorming session.',
            price:price,
            author:'6618fd0274e60247eb9fcdab'
        })
        await camp.save();
    }
}
seedDb().then(()=>db.close())