import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    topic: process.env.KAFKA_TOPIC || 'my-topic',
    clientId: 'producer-noconsumer',
  },
  ksqldb: {
    host: process.env.KSQLDB_HOST || 'localhost',
    port: process.env.KSQLDB_PORT || '8088',
    get url() {
      return `http://${this.host}:${this.port}`;
    }
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
  }
}; 