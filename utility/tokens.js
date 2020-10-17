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

const getSignedEmailVerificationToken = (payload) => {
  return jwt.sign(payload, process.env.EMAIL_SECRET, {
    expiresIn: process.env.EMAIL_TOKEN_EXPIRY,
  });
};

const verifyEmailToken = (requestToken) => {
  return jwt.verify(requestToken, process.env.EMAIL_SECRET);
};

export {
  getSignedJwtToken,
  getResetPasswordToken,
  getSignedEmailVerificationToken,
  verifyEmailToken,
};
