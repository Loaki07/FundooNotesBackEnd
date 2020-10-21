import Joi from '@hapi/joi';

class Validation {
  /**
   * @description Validation using Joi for User schema
   * @param {Object} user
   */
  validateUserRegistration = async (user) => {
    const validateObject = Joi.object({
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(3).required(),
      emailId: Joi.string().email().lowercase().required(),
      password: Joi.string().min(6).required(),
    });

    return await validateObject.validateAsync(user);
  };

  /**
   * @description Validation using Joi for Note schema
   * @param {Object} note
   */
  validateNote = async (note) => {
    const validateObject = Joi.object({
      title: Joi.string().min(3).required(),
      description: Joi.string(),
    });
    return await validateObject.validateAsync(note);
  };
}

export default Validation;
