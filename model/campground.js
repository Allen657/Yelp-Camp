const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review');
const opts = { toJSON: { virtuals: true } };

const imageSchema = new Schema({
        url:String,
        filename:String
});
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/c_fill,w_150,h_150');
})
const campground = new Schema({
    title:String,
    image:[imageSchema],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:'Review'
    }]

},opts);
campground.virtual('properties.popupText').get(function(){
    return `<a href="campgrounds/${this._id}">${this.title}</a>
            <p>${this.description.substring(0,20)}</p>
    `;
})
campground.post('findOneAndDelete',async(camp)=>{
    if(camp.reviews.length){
        const ress = await Review.deleteMany({_id:{$in:camp.reviews}});
        console.log(ress);
    }
})
module.exports = mongoose.model('Campground',campground)
