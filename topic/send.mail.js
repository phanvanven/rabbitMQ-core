const amqplib = require('amqplib');
const amqp_url_docker = 'amqp://guest:12345@localhost';

const sendEmail = async()=>{
    try {
        // 1. create connection
        const connection = await amqplib.connect(amqp_url_docker);
        // 2. create channel
        const channel = await connection.createChannel();
        // 3. create exchange
        const exchangeName = 'send_email';
        await channel.assertExchange(exchangeName, 'topic',{
            durable: false
        });

        const args = process.argv.slice(2);
        const msg = args[1] || 'Fixed!';
        const topic = args[0];
        console.log(`msg: ${msg}| topic: ${topic}`);
        // 4. publish email
        await channel.publish(exchangeName, topic, Buffer.from(msg));
        console.log(`[x] Send Ok: ${msg}`);
        setTimeout(function(){
            connection.close();
            process.exit(0);
        }, 2000);
    } catch (error) {
        console.error(error.message);
    }
}

sendEmail();