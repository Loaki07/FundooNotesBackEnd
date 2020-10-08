import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * @description Sign JWT
 * @param {payload} id
 * @returns jwt token
 */
const getSignedJwtToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate and hash password token
const getResetPasswordToken = () => {
  const resetToken = crypto.randomBytes(20).toString('hex');
  return resetToken;
};

export { getSignedJwtToken, getResetPasswordToken };
