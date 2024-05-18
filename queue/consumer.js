const amqplib = require('amqplib');
const amqp_url_docker = 'amqp://guest:12345@localhost';
const receiveQueue = async () => {
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
            durable: false // Data in queue will be lost if your server is cracked or shut down suddenly
        });
        // 5. receive messages from queue
        await channel.consume(queueName, msg =>{
            console.log(`Msg: `, msg.content.toString());
        },{
            noAck: true
        });
        // 6. close connection and channel

        
    } catch (error) {
        console.log(`Error: `, error.message);
    }
}

receiveQueue();