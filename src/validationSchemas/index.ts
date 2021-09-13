const Joi = require('joi');

const registrationSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).required(),
	email: Joi.string().email().min(5).max(30).required(),
	password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
	repeat_password: Joi.ref('password'),
});

const loginSchema = Joi.object({
	email: Joi.string().email().min(5).max(30).required(),
	password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
});
export { registrationSchema, loginSchema };
