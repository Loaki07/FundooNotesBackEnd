import sendEmail from '../utility/sendEmail.js';
import RabbitMQ from '../msgQueue/rabbitMQ.js';
import logger from '../config/logger.js';
import { getSignedEmailVerificationToken } from '../utility/tokens.js';
import { UserModel } from '../models/user.js';
const { sendToQueue, consumeFromQueue } = new RabbitMQ();
const { findOne } = new UserModel();

const verifyEmail = async (req, res, next) => {
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

      await sendToQueue({
        emailId,
        subject: 'FundooApp Email Verification',
        message,
      });
      await consumeFromQueue();
      res.send({
        success: false,
        message:
          'Email is not verified!, \nCheck your inbox to veriy it using the link sent.',
      });
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
