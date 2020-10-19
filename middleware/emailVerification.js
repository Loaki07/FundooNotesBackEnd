import sendEmail from '../utility/sendEmail.js';
import sendToQueue from '../messageQueue/publisher.js';
import consumeFromQueue from '../messageQueue/consumer.js';
import logger from '../config/logger.js';
import { getSignedEmailVerificationToken } from '../utility/tokens.js';
import { UserModel } from '../models/user.js';
const { findOne } = new UserModel();

const verifyEmail = async (req, res, next) => {
  console.log('At Email Auth');
  const responseData = {};
  try {
    const { emailId } = req.body;
    const user = await findOne({ emailId });
    if (!user.isEmailVerified) {
      let signedVerificationToken = getSignedEmailVerificationToken({
        emailId,
      });

      const verificationUrl = `${req.protocol}://${req.get(
        'host'
      )}/fundooapp/verify-email/${signedVerificationToken}`;

      const message = `Please click this email to confirm your email: <a href=${verificationUrl}>${verificationUrl}</a>`;

      sendToQueue({
        emailId,
        subject: 'FundooApp Email Verification',
        message,
      });
      // consumeFromQueue()
      // res.redirect('/login');
      logger.error('User Email Verification is not complete!');
    } else {
      next();
    }
  } catch (error) {
    responseData.success = false;
    responseData.message = error.message;
    logger.error(error.message);
    res.status(500).send(responseData);
  }
};

export { verifyEmail };
