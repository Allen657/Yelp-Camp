const Campground = require('./model/campground');
const Review = require('./model/review');
const expressError = require('./utils/expressError');
const {campgroundSchema} = require('./schema');
const {reviewSchema} = require('./schema');

module.exports.storeReturnTo = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You are not Logged in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You dont have the permission');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You dont have the permission');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
//JOI schema validation
module.exports.validateCampground = (req, res, next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(err=>err.message).join(',')
        throw new expressError(msg,400);
    }else {
        next();
    }
}
module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(err=>err.message).join(',')
        throw new expressError(msg,400);
    }else {
        next();
    }
}