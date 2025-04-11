"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ksqlDBService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
class KsqlDBService {
    constructor() {
        this.baseUrl = config_1.config.ksqldb.url;
    }
    /**
     * Execute a one-time pull query against ksqlDB
     * @param query SQL query to execute
     * @returns Query results
     */
    async pullQuery(query) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/query`, { ksql: query, streamsProperties: {} }, { headers: { 'Content-Type': 'application/vnd.ksql.v1+json' } });
            return response.data;
        }
        catch (error) {
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
    async pushQuery(query, callback) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/query-stream`, {
                sql: query,
                properties: { "ksql.streams.auto.offset.reset": "earliest" }
            }, {
                headers: { 'Content-Type': 'application/vnd.ksql.v1+json' },
                responseType: 'stream'
            });
            response.data.on('data', (chunk) => {
                try {
                    const data = JSON.parse(chunk.toString());
                    callback(data);
                }
                catch (e) {
                    console.error('Error parsing chunk:', e);
                }
            });
            return () => {
                if (response.data) {
                    response.data.destroy();
                }
            };
        }
        catch (error) {
            console.error('Error executing push query:', error);
            throw error;
        }
    }
    /**
     * Execute ksqlDB statements (CREATE, DROP, etc.)
     * @param statement SQL statement to execute
     * @returns Results of the statement execution
     */
    async executeStatement(statement) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/ksql`, { ksql: statement, streamsProperties: {} }, { headers: { 'Content-Type': 'application/vnd.ksql.v1+json' } });
            return response.data;
        }
        catch (error) {
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
    async createStream(streamName, topicName, valueFormat = 'JSON') {
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
    async createMaterializedView(tableName, streamName, groupByColumn = 'id') {
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
exports.ksqlDBService = new KsqlDBService();
