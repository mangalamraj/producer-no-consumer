import { Request, Response } from 'express';
import { kafkaService } from '../services/kafka.service';
import { config } from '../config';

/**
 * Send a message to the default Kafka topic
 * @param req Express request
 * @param res Express response
 */
export const produceMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, key } = req.body;
    
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }
    
    await kafkaService.sendMessage(config.kafka.topic, message, key);
    
    res.status(200).json({ 
      success: true,
      topic: config.kafka.topic,
      message: 'Message produced successfully'
    });
  } catch (error) {
    console.error('Error producing message:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to produce message'
    });
  }
};

/**
 * Send a message to a specified Kafka topic
 * @param req Express request
 * @param res Express response
 */
export const produceMessageToTopic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic } = req.params;
    const { message, key } = req.body;
    
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }
    
    if (!topic) {
      res.status(400).json({ error: 'Topic is required' });
      return;
    }
    
    await kafkaService.sendMessage(topic, message, key);
    
    res.status(200).json({ 
      success: true,
      topic,
      message: 'Message produced successfully'
    });
  } catch (error) {
    console.error('Error producing message:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to produce message'
    });
  }
};

/**
 * Send batch messages to the default Kafka topic
 * @param req Express request
 * @param res Express response
 */
export const produceBatchMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }
    
    await kafkaService.sendBatchMessages(config.kafka.topic, messages);
    
    res.status(200).json({ 
      success: true,
      topic: config.kafka.topic,
      count: messages.length,
      message: 'Batch messages produced successfully'
    });
  } catch (error) {
    console.error('Error producing batch messages:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to produce batch messages'
    });
  }
}; 