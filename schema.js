const Jois = require('joi');
const sanitizeHTML = require('sanitize-html')
const Joi = Jois.extend((joi)=>({
    type:'string',
    base:joi.string(),
    messages:{
        'string.escapeHTML':'{{#label}} must not include HTML!',
    },
    rules:{
        escapeHTML:{
            validate(value, helpers){
                const sanitized = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if(sanitized!== value) return helpers.error('string.escapeHTML',{value});
                return sanitized;
            }
        }
    }
}))
module.exports.campgroundSchema = new Joi.object({
    campground:Joi.object({
        title:Joi.string().required().escapeHTML(),
        price:Joi.number().required().min(0),
        location:Joi.string().required().escapeHTML(),
        description:Joi.string().required().escapeHTML(),

    }).required(),
    deleteImages:Joi.array()
})

module.exports.reviewSchema = new Joi.object({
    review:Joi.object({
        body:Joi.string().required().escapeHTML(),
        rating:Joi.number().min(1).max(5).required()
    }).required()
})