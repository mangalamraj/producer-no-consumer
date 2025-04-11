"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
/**
 * Example client for Kafka Producer and ksqlDB API
 * This simulates a client that sends messages to Kafka and
 * retrieves data from ksqlDB without using Kafka consumer
 */
const API_URL = 'http://localhost:3000';
/**
 * Initialize ksqlDB streams and tables
 */
async function initializeKsqlDB() {
    try {
        const response = await axios_1.default.post(`${API_URL}/api/ksqldb/initialize`);
        console.log('ksqlDB initialized:', response.data);
        return response.data;
    }
    catch (error) {
        console.error('Error initializing ksqlDB:', error);
        throw error;
    }
}
/**
 * Produce a message to the default Kafka topic
 * @param message Message content
 * @param key Optional message key
 */
async function produceMessage(message, key) {
    try {
        const response = await axios_1.default.post(`${API_URL}/api/kafka/produce`, {
            message,
            key
        });
        console.log('Message produced:', response.data);
        return response.data;
    }
    catch (error) {
        console.error('Error producing message:', error);
        throw error;
    }
}
/**
 * Query latest message for a specific ID from ksqlDB
 * @param id Message ID (key)
 */
async function getLatestMessageById(id) {
    try {
        const response = await axios_1.default.get(`${API_URL}/api/ksqldb/messages/${id}`);
        console.log(`Latest message for ID ${id}:`, response.data);
        return response.data;
    }
    catch (error) {
        console.error(`Error retrieving message for ID ${id}:`, error);
        throw error;
    }
}
/**
 * Execute a custom ksqlDB pull query
 * @param query SQL query to execute
 */
async function executeQuery(query) {
    try {
        const response = await axios_1.default.post(`${API_URL}/api/ksqldb/query`, { query });
        console.log('Query results:', response.data);
        return response.data;
    }
    catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}
/**
 * Run the example client
 */
async function runExample() {
    try {
        // Initialize ksqlDB
        await initializeKsqlDB();
        // Produce some messages
        const messageKey = 'user-123';
        await produceMessage('Hello, World!', messageKey);
        await produceMessage('Hello again!', messageKey);
        await produceMessage('Third message', messageKey);
        // Wait a moment for ksqlDB to process the messages
        console.log('Waiting for ksqlDB to process messages...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        // Query the latest message
        await getLatestMessageById(messageKey);
        // Execute a custom query
        await executeQuery('SELECT * FROM messages_table WHERE message_count > 1;');
    }
    catch (error) {
        console.error('Example failed:', error);
    }
}
// Run the example
runExample();
/**
 * To run this example:
 * 1. Start the server: npm run dev
 * 2. Make sure Kafka and ksqlDB are running
 * 3. Run this script: npx ts-node src/client-example.ts
 */ 
