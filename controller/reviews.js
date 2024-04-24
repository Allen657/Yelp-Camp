const Campground = require('../model/campground');
const Review = require('../model/review');

module.exports.review = {
    addReview : async(req,res)=>{
        const {id} = req.params;
        const campground = await Campground.findByIdAndUpdate(id);
        const review = await new Review(req.body.review);
        review.author = req.user._id;
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash('success','Successfully Created a Review');
        res.redirect(`/campgrounds/${id}`);
    
    },
    deleteReview : async(req,res)=>{
        const {id, reviewId} = req.params;
        await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash('success','Successfully Deleted a Review')
        res.redirect(`/campgrounds/${id}`);
    },

}