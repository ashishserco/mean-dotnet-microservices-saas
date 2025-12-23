import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import amqp from 'amqplib';
import { analyzeClaim } from './services/openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'AI Service' });
});

// RabbitMQ Consumer
const startConsumer = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = 'claim_analysis_queue';

    await channel.assertQueue(queue, { durable: true });
    console.log(`Waiting for messages in ${queue}...`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log('Received claim for analysis:', content.claimId);

        try {
          const analysis = await analyzeClaim(content.description);
          
          // Publish result to a results queue (or call Claims Service via API)
          // For this demo, we'll just log it. In real life, we'd publish 'claim_analyzed_event'
          console.log('Analysis Result:', analysis);
          
          // Acknowledge message
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          // channel.nack(msg); // Optionally requeue
        }
      }
    });
  } catch (error) {
    console.error('RabbitMQ Connection Error:', error);
    // Retry logic would go here
  }
};

// Start Consumer (delayed to allow RabbitMQ to start in Docker)
setTimeout(startConsumer, 10000);

app.listen(PORT, () => console.log(`AI Service running on port ${PORT}`));
