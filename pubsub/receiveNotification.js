const amqplib = require('amqplib');
const amqp_url_docker = 'amqp://guest:12345@localhost';

const receiveNotification = async()=>{
    try {
        // 1. create connection
        const connection = await amqplib.connect(amqp_url_docker);
        // 2. create channel
        const channel = await connection.createChannel();
        // 3. create exchange
        const exchangeName = 'video';
        await channel.assertExchange(exchangeName, 'fanout',{
            durable: false
        });
        // 4. create queue
        const {
            queue // queue name
        } = await channel.assertQueue('',{
            exclusive: true // queues will auto-delete when consumer disconnects
        });
        console.log(`queueName: ${queue}`);
        // 5. binding - A relationship between exchange and queue is called binding.
        await channel.bindQueue(queue, exchangeName, '');
        await channel.consume(queue, msg=>{
            console.log(`msg: ${msg.content.toString()}`);
        },{
            noAck: true
        });
    } catch (error) {
        console.error(error.message);
    }
}

receiveNotification();