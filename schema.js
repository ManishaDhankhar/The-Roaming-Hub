const Joi=require("joi");

const schemaValidation=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.string().allow("",null),
        price:Joi.number().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
    }).required()
})
module.exports={schemaValidation};
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
      rating:Joi.number().min(1).max(5).required(),
      content:Joi.required(),
    }).required()
})