import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { config } from '../config';

class KafkaService {
  private producer: Producer;
  private isConnected: boolean = false;
  
  constructor() {
    const kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: config.kafka.brokers
    });
    
    this.producer = kafka.producer();
  }
  
  /**
   * Connect to Kafka broker
   */
  async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.producer.connect();
        this.isConnected = true;
        console.log('Connected to Kafka broker');
      } catch (error) {
        console.error('Failed to connect to Kafka broker:', error);
        throw error;
      }
    }
  }
  
  /**
   * Disconnect from Kafka broker
   */
  async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.producer.disconnect();
        this.isConnected = false;
        console.log('Disconnected from Kafka broker');
      } catch (error) {
        console.error('Failed to disconnect from Kafka broker:', error);
        throw error;
      }
    }
  }
  
  /**
   * Send a message to a Kafka topic
   * @param topic Kafka topic
   * @param message Message to send
   * @param key Optional key for the message
   */
  async sendMessage(topic: string, message: any, key?: string): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    try {
      const record: ProducerRecord = {
        topic,
        messages: [
          {
            key: key || String(Date.now()),
            value: typeof message === 'string' ? message : JSON.stringify(message)
          }
        ]
      };
      
      await this.producer.send(record);
      console.log(`Message sent to topic ${topic}`);
    } catch (error) {
      console.error(`Failed to send message to topic ${topic}:`, error);
      throw error;
    }
  }
  
  /**
   * Send multiple messages to a Kafka topic
   * @param topic Kafka topic
   * @param messages Array of messages to send
   */
  async sendBatchMessages(
    topic: string, 
    messages: Array<{ value: any, key?: string }>
  ): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    try {
      const record: ProducerRecord = {
        topic,
        messages: messages.map(msg => ({
          key: msg.key || String(Date.now()),
          value: typeof msg.value === 'string' ? msg.value : JSON.stringify(msg.value)
        }))
      };
      
      await this.producer.send(record);
      console.log(`Batch of ${messages.length} messages sent to topic ${topic}`);
    } catch (error) {
      console.error(`Failed to send batch messages to topic ${topic}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const kafkaService = new KafkaService(); 