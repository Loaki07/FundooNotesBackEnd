import Joi from '@hapi/joi';

const validateUserRegistration = async (user) => {
  const validateObject = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
  });

  return await validateObject.validateAsync(user);
};

export { validateUserRegistration };
