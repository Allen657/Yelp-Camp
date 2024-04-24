const express = require('express')
const router = express.Router();
const {campground} =require('../controller/campgrounds');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware');
const {storage,cloudinary} = require('../cloudinary');
const multer = require('multer');
const upload = multer({storage});
// 
// const filename = 'YelpCamp/p3yhhfzraxjt7bdvvacx'
// cloudinary.uploader.destroy(filename);

router.route('/')
    .get(campground.index)
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campground.newCampground));

router.get('/new',isLoggedIn,campground.renderNewCampground);

router.route('/:id')
    .get(catchAsync(campground.renderCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campground.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campground.deleteCampground));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campground.renderEditCampground));




module.exports = router;