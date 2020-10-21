import amqp from 'amqplib';
import sendEmail from '../utility/sendEmail.js';
import logger from '../config/logger.js';
import { ErrorResponse } from '../utility/errorResponse.js';

class RabbitMqMessageQueue {
  /**
   * @description Creates the channel for queue
   */
  connectToRabbitMQ = async () => {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_PORT);
      const channel = await connection.createChannel();
      const isQueuePresent = await channel.assertQueue('fundooApp', {
        durable: true,
      });
      logger.info('Connected to RabbitMQ!');
      return channel;
    } catch (error) {
      logger.error(error.message);
      throw new ErrorResponse(error.message, error.statusCode);
    }
  };

  /**
   * @name Publisher
   * @description Creates the object from the received data and sends it to the queue
   * @param {Object} options
   */
  sendToQueue = async (options) => {
    try {
      const message = {
        from: `${process.env.FROM_NAME} ${process.env.FROM_EMAIL}`,
        emailId: options.emailId,
        subject: options.subject,
        message: options.message,
      };
      const channel = await this.connectToRabbitMQ();
      channel.sendToQueue('fundooApp', Buffer.from(JSON.stringify(message)));

      console.log(`Message sent to queue!`);
      logger.info(`Message sent to queue!`);
    } catch (error) {
      console.log(error.stack);
      logger.error(error.message);
      throw new ErrorResponse(error.message, error.statusCode);
    }
  };

  /**
   * @name Consumer
   * @description Comsumes the requests from the queue and sends the mail accordingly using nodemailer
   * @param {Object} options
   */
  consumeFromQueue = async () => {
    try {
      const channel = await this.connectToRabbitMQ();
      channel.consume('fundooApp', (message) => {
        const input = JSON.parse(message.content.toString());
        sendEmail(input);
        console.log('Sending Email from queue...');
        channel.ack(message);
      });
    } catch (error) {
      logger.error(error.message);
      throw new ErrorResponse(error.message, error.statusCode);
    }
  };
}

export default RabbitMqMessageQueue;
