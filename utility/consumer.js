import amqp from 'amqplib';

consumeFromQueue = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();
    const result = await channel.assertQueue('fundooApp');
    channel.consume('fundooApp', (message) => {
      console.log(JSON.stringify(message));
    });
    console.log('Waiting for messages');
  } catch (error) {
    console.log(error);
  }
};

export default consumeFromQueue;
