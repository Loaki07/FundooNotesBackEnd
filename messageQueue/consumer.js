import amqp from 'amqplib';
import sendEmail from '../utility/sendEmail.js';

const consumeFromQueue = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();
    if (!channel) throw new Error();
    const result = await channel.assertQueue('fundooApp');
    channel.consume('fundooApp', (message) => {
      // sendEmail(message);
      console.log('From Consumer', JSON.stringify(message));
    });
    channel.ack(message);
    console.log('Waiting for messages');
  } catch (error) {
    console.log(error);
  }
};

export default consumeFromQueue;
