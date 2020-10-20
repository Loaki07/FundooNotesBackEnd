import amqp from 'amqplib';

const sendToQueue = async (options) => {
  try {
    const message = {
      from: `${process.env.FROM_NAME} ${process.env.FROM_EMAIL}`,
      emailId: options.emailId,
      subject: options.subject,
      message: options.message,
    };
    const connection = await amqp.connect(process.env.RABBITMQ_PORT);
    const channel = await connection.createChannel();
    const result = await channel.assertQueue('fundooApp', {
      durable: true,
    });
    channel.sendToQueue('fundooApp', Buffer.from(JSON.stringify(message)));
    console.log(`Message sent to queue!`);
  } catch (error) {
    throw new Error(error.message);
  }
};

export default sendToQueue;
