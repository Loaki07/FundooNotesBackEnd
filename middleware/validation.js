import Joi from '@hapi/joi';

class Validation {
  validateUserRegistration = async (user) => {
    const validateObject = Joi.object({
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(3).required(),
      emailId: Joi.string().email().lowercase().required(),
      password: Joi.string().min(6).required(),
    });

    return await validateObject.validateAsync(user);
  };

  validateNote = async (note) => {
    const validateObject = Joi.object({
      title: Joi.string().min(3).required(),
      description: Joi.string(),
    });
    return await validateObject.validateAsync(note);
  };
}

export default Validation;
