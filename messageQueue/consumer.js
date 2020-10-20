import amqp from 'amqplib';
import sendEmail from '../utility/sendEmail.js';

const consumeFromQueue = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();
    const result = await channel.assertQueue('fundooApp');
    console.log(result);
    channel.consume('fundooApp', (message) => {
      const input = JSON.parse(message.content.toString());
      sendEmail(input);
      console.log('Sending Email from queue...');
      channel.ack(message);
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export default consumeFromQueue;
