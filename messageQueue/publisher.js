import amqp from 'amqplib';

const sendToQueue = async (options) => {
  try {
    const message = {
      from: `process.env.FROM_NAME ${process.env.FROM_EMAIL}`,
      to: options.emailId,
      subject: options.subject,
      html: options.message,
    };
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();
    const result = await channel.assertQueue('fundooApp', {
      durable: true,
    });
    channel.sendToQueue('fundooApp', Buffer.from(JSON.stringify(message)));
    console.log(`Email Verification link sent successfully ${JSON.stringify(message)}`);
  } catch (error) {
    console.log(error);
  }
};

export default sendToQueue;
