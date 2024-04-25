if(process.env.NODE_ENV !=='production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const db = mongoose.connection;
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const expressError = require('./utils/expressError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./model/user');
const helmet = require('helmet');
const dbUrl = process.env.MONGODB_URL;
const mongoStore = require('connect-mongo');
const store = mongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto:{
        secret:'samplesecret!'
    }
})
//configurations for session new comment
const sessionConfig = {
    store,
    name:'session',
    secret: 'Thisisasecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
// 'mongodb://127.0.0.1:27017/yelp-camp'
mongoose.connect(dbUrl);

db.on("error",console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log('Database Connected');
})
//setting up views and req.body parser
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, '/views'));
app.engine('ejs',engine);
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//starting sessions
app.use(session(sessionConfig));
app.use(flash())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dduiomi6y/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
//using passportjs, passport-local, passport-local-mongoose for user auth
//should be before session() middleware
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flashes an message for completion of tasks or error
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
//campground route
app.use('/campgrounds',campgroundRoutes);
//review route
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);
app.get('/',(req,res)=>{
    res.render('home');
});
//should be last
//error handlers
app.all('*',(req,res,next)=>{
    throw new expressError('Page Not Found',404);
});
//when an error is thrown within inside the routes, this middleware catches it
app.use((err,req,res,next)=>{
    const {status = 500} = err;
    if(!err.message)err.message = 'An Error occured';
    res.status(status).render('error',{err});
});
app.listen(3000,()=>{
    console.log('port 300');
});