const Joi = require('@hapi/joi')

const authSchema = Joi.object({
    username: Joi.string().trim().lowercase().required().min(4).alphanum(),
    email: Joi.string().lowercase().required().email(),
    password: Joi.string().required().min(8).required().regex(/^[\w]{8,30}$/)
})
 
module.exports={
    authSchema
}