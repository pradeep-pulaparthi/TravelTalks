const Joi = require('joi');

// Password validation schema
const userValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\\W]).{6,}$'))
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.pattern.base': 'Password must contain at least one letter, one number, and one special character'
    }),
});
module.exports={userValidationSchema};