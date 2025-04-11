import express from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';
import { kafkaService } from './services/kafka.service';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use(routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(config.server.port, async () => {
  console.log(`Server running on port ${config.server.port} in ${config.server.env} mode`);
  
  try {
    // Connect to Kafka broker
    await kafkaService.connect();
    console.log('Connected to Kafka broker');
    
    // Add shutdown handler
    process.on('SIGINT', async () => {
      console.log('Shutting down...');
      await kafkaService.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start services:', error);
    process.exit(1);
  }
});

export default app; 