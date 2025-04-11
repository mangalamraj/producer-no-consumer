import { Request, Response } from 'express';
import { ksqlDBService } from '../services/ksqldb.service';
import { config } from '../config';

/**
 * Initialize ksqlDB streams and tables
 * @param req Express request
 * @param res Express response
 */
export const initializeKsqlDB = async (req: Request, res: Response): Promise<void> => {
  try {
    // Create a stream from the Kafka topic
    const streamName = 'messages_stream';
    const topicName = config.kafka.topic;
    
    const streamResult = await ksqlDBService.createStream(streamName, topicName);
    
    // Create a materialized view (table) from the stream
    const tableName = 'messages_table';
    const tableResult = await ksqlDBService.createMaterializedView(tableName, streamName);
    
    res.status(200).json({
      success: true,
      message: 'ksqlDB streams and tables initialized successfully',
      results: {
        stream: streamResult,
        table: tableResult
      }
    });
  } catch (error) {
    console.error('Error initializing ksqlDB:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize ksqlDB'
    });
  }
};

/**
 * Execute a pull query against ksqlDB
 * @param req Express request
 * @param res Express response
 */
export const executePullQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }
    
    const result = await ksqlDBService.pullQuery(query);
    
    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error executing pull query:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute pull query'
    });
  }
};

/**
 * Get the latest message for a specific ID
 * @param req Express request
 * @param res Express response
 */
export const getLatestMessageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ error: 'ID is required' });
      return;
    }
    
    const query = `SELECT * FROM messages_table WHERE ROWKEY='${id}';`;
    const result = await ksqlDBService.pullQuery(query);
    
    res.status(200).json({
      success: true,
      id,
      result
    });
  } catch (error) {
    console.error(`Error getting latest message for ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: `Failed to get latest message for ID ${req.params.id}`
    });
  }
};

/**
 * Execute a custom ksqlDB statement
 * @param req Express request
 * @param res Express response
 */
export const executeStatement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { statement } = req.body;
    
    if (!statement) {
      res.status(400).json({ error: 'Statement is required' });
      return;
    }
    
    const result = await ksqlDBService.executeStatement(statement);
    
    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error executing statement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute statement'
    });
  }
}; 