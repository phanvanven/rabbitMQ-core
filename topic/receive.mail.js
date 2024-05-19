const amqplib = require('amqplib');
const amqp_url_docker = 'amqp://guest:12345@localhost';

const receiveEmail = async()=>{
    try {

        /*
            <<NOTE>> * and #
        */
        // 1. create connection
        const connection = await amqplib.connect(amqp_url_docker);
        // 2. create channel
        const channel = await connection.createChannel();
        // 3. create exchange
        const exchangeName = 'send_email';
        await channel.assertExchange(exchangeName, 'topic',{
            durable: false
        });

        // 4. create queue
        const {
            queue
        } = await channel.assertQueue('',{
            exclusive: true // queues will auto-delete when consumer disconnects
        });

        // 5. binding
        const args = process.argv.slice(2);
        if(!args.length){
            process.exit(0);
        }
        console.log(`waiting for queue ${queue} | topic: ${args}`);
        args.forEach(async key =>{
            await channel.bindQueue(queue, exchangeName, key);
        })
        await channel.consume(queue, msg =>{
            console.log(`Routing key: ${msg.fields.routingKey} | msg: ${msg.content.toString()}`);
        })
    } catch (error) {
        console.error(error.message);
    }
}

receiveEmail();