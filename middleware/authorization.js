import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.js';
const { getProtectedUser } = new UserModel();

const auth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If token does not exist throw error
    if (!token) {
      throw new Error('Not authorized to access to this route');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await getProtectedUser(decoded._id);

    if (!req.user) {
      throw new Error('Invalid/Expired Token');
    }
    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      error: error.message,
    });
  }
};

export { auth };
