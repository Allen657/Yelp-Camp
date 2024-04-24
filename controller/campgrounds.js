const { cloudinary } = require('../cloudinary');
const Campground = require('../model/campground');
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoService = mbxGeoCoding({accessToken:mapBoxToken});

module.exports.campground = {
    index : async(req,res)=>{
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', {campgrounds});
    },
    renderCampground : async(req, res)=>{
        const {id} = req.params;
        const campground = await Campground.findById(id)
            .populate({
                path:'reviews',
                populate:{
                    path:'author'
                }
            })
            .populate('author');
        if(!campground){
            req.flash('error','Campground not Found');
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', {campground});
    },
    newCampground : async(req,res)=>{
        const geo = await geoService.forwardGeocode({
            query: req.body.campground.location,
            limit: 2
          })
            .send();
        // console.log(geo.body.features[0].geometry.coordinates);
        const campground = new Campground(req.body.campground);
        campground.geometry = geo.body.features[0].geometry;
        campground.image = req.files.map(img=>({url:img.path,filename:img.filename}));
        campground.author = req.user._id;
        await campground.save();
        req.flash('success','You have successfuly created a new campground')
        res.redirect(`/campgrounds/${campground._id}`);
    },
    
    updateCampground : async(req,res)=>{
        const{id} = req.params;
        const geo = await geoService.forwardGeocode({
            query: req.body.campground.location,
            limit: 2
          })
            .send();
            //findById first and push the lng and ltd and update the campground
        const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
        const imgs = req.files.map(img=>({url:img.path,filename:img.filename}));
        campground.image.push(...imgs);
        campground.geometry = geo.body.features[0].geometry;
        await campground.save();
        if(req.body.deleteImages){
            for(filename of req.body.deleteImages){
                await cloudinary.uploader.destroy(filename);
            }
            await campground.updateOne({$pull:{image:{filename:{$in: req.body.deleteImages}}}});
        }
        req.flash('success','Successfully Updated a Campground');
        res.redirect(`/campgrounds/${id}`);
    },
    
    deleteCampground : async(req,res)=>{
        const {id} = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('success','Successfully Deleted a Campground');
        res.redirect('/campgrounds');
    },
    
    renderEditCampground : async(req, res)=>{
        const campground = await Campground.findById(req.params.id);
        if(!campground){
            req.flash('error','Campground not Found');
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit',{campground});
    },
    renderNewCampground : (req, res)=>{
        res.render('campgrounds/new')
    }
}