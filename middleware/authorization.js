import jwt from 'jsonwebtoken';
import { User } from '../models/userSchema.js';

const protect = async (req, res, next) => {
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
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      error: error.message,
    });
  }
};

export { protect };
