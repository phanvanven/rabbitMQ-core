const amqplib = require('amqplib');
const amqp_url_docker = 'amqp://guest:12345@localhost';

const postVideo = async({msg})=>{
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
        // 4. publish video
        await channel.publish(exchangeName, '', Buffer.from(msg));
        console.log(`[x] Send Ok: ${msg}`);
        setTimeout(function(){
            connection.close();
            process.exit(0);
        }, 2000);
    } catch (error) {
        console.error(error.message);
    }
}

const msg = process.argv.slice(2).join(' ') || "Hello exchange";
postVideo({msg});