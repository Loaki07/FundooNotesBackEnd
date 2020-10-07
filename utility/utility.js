import jwt from 'jsonwebtoken';

const getSignedJwtToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export { getSignedJwtToken };
