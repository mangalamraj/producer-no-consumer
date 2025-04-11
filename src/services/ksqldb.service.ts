import axios from 'axios';
import { config } from '../config';

class KsqlDBService {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = config.ksqldb.url;
  }

  /**
   * Execute a one-time pull query against ksqlDB
   * @param query SQL query to execute
   * @returns Query results
   */
  async pullQuery(query: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/query`,
        { ksql: query, streamsProperties: {} },
        { headers: { 'Content-Type': 'application/vnd.ksql.v1+json' } }
      );
      return response.data;
    } catch (error) {
      console.error('Error executing pull query:', error);
      throw error;
    }
  }
  
  /**
   * Execute a streaming push query against ksqlDB
   * @param query SQL query to execute
   * @param callback Function to process each chunk of data
   * @returns A function to stop the stream
   */
  async pushQuery(query: string, callback: (data: any) => void): Promise<() => void> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/query-stream`,
        { 
          sql: query, 
          properties: { "ksql.streams.auto.offset.reset": "earliest" } 
        },
        { 
          headers: { 'Content-Type': 'application/vnd.ksql.v1+json' },
          responseType: 'stream'
        }
      );
      
      response.data.on('data', (chunk: Buffer) => {
        try {
          const data = JSON.parse(chunk.toString());
          callback(data);
        } catch (e) {
          console.error('Error parsing chunk:', e);
        }
      });
      
      return () => {
        if (response.data) {
          response.data.destroy();
        }
      };
    } catch (error) {
      console.error('Error executing push query:', error);
      throw error;
    }
  }

  /**
   * Execute ksqlDB statements (CREATE, DROP, etc.)
   * @param statement SQL statement to execute
   * @returns Results of the statement execution
   */
  async executeStatement(statement: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/ksql`,
        { ksql: statement, streamsProperties: {} },
        { headers: { 'Content-Type': 'application/vnd.ksql.v1+json' } }
      );
      return response.data;
    } catch (error) {
      console.error('Error executing statement:', error);
      throw error;
    }
  }

  /**
   * Create a stream from a Kafka topic
   * @param streamName Name of the stream to create
   * @param topicName Name of the Kafka topic
   * @param valueFormat Format of the data (JSON, AVRO, etc.)
   * @returns Results of the stream creation
   */
  async createStream(streamName: string, topicName: string, valueFormat: string = 'JSON'): Promise<any> {
    const statement = `
      CREATE STREAM IF NOT EXISTS ${streamName} (
        id STRING KEY,
        message STRING,
        timestamp BIGINT
      ) WITH (
        KAFKA_TOPIC='${topicName}',
        VALUE_FORMAT='${valueFormat}'
      );
    `;
    
    return this.executeStatement(statement);
  }

  /**
   * Create a materialized view (table) from a stream
   * @param tableName Name of the table to create
   * @param streamName Name of the source stream
   * @param groupByColumn Column to group by
   * @returns Results of the table creation
   */
  async createMaterializedView(
    tableName: string, 
    streamName: string, 
    groupByColumn: string = 'id'
  ): Promise<any> {
    const statement = `
      CREATE TABLE IF NOT EXISTS ${tableName} AS
      SELECT
        ${groupByColumn},
        LATEST_BY_OFFSET(message) AS latest_message,
        COUNT(*) AS message_count
      FROM ${streamName}
      GROUP BY ${groupByColumn}
      EMIT CHANGES;
    `;
    
    return this.executeStatement(statement);
  }
}

// Export a singleton instance
export const ksqlDBService = new KsqlDBService(); 