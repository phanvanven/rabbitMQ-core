const amqplib = require('amqplib');
const amqp_url_docker = 'amqp://guest:12345@localhost';
const sendQueue = async ({ msg }) => {
    try {
        // 1. create connection
        const connection = await amqplib.connect(amqp_url_docker);
        // 2. create channel
        const channel = await connection.createChannel();
        // 3. create queue name
        const queueName = 'test-mq-1';
        // 4. create queue
        // const queueName = await channel.assertQueue(); The queue name will be created automatically if we don't set it up beforehand
        await channel.assertQueue(queueName,{
            durable: true //If 'durable' is 'false' then data (message) in queue will be lost if your RabbitMQ service is cracked or shut down suddenly.
        });
        // 5. send messages to queue
        // + Buffer sends data as bytes so it will send data much faster. 
        // + Data encryption is supported by buffer, which can enhance data security even more.
        await channel.sendToQueue(queueName, Buffer.from(msg), {
            // expiration: '10000', // TTL,
            persistent: true // The message will be handled constantly, and the queue will be stored on disk or in a cache. If there is a problem with caching, then RabbitMQ will use disk to run.
        }); 
        // 6. close connection and channel

        
    } catch (error) {
        console.log(`Error: `, error.message);
    }
}
const msg = process.argv.slice(2).join(' ') || 'Hello';
// bin.node path string - ex: node producer.js hello1
sendQueue({msg})