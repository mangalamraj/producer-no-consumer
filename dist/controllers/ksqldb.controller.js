"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeStatement = exports.getLatestMessageById = exports.executePullQuery = exports.initializeKsqlDB = void 0;
const ksqldb_service_1 = require("../services/ksqldb.service");
const config_1 = require("../config");
/**
 * Initialize ksqlDB streams and tables
 * @param req Express request
 * @param res Express response
 */
const initializeKsqlDB = async (req, res) => {
    try {
        // Create a stream from the Kafka topic
        const streamName = 'messages_stream';
        const topicName = config_1.config.kafka.topic;
        const streamResult = await ksqldb_service_1.ksqlDBService.createStream(streamName, topicName);
        // Create a materialized view (table) from the stream
        const tableName = 'messages_table';
        const tableResult = await ksqldb_service_1.ksqlDBService.createMaterializedView(tableName, streamName);
        res.status(200).json({
            success: true,
            message: 'ksqlDB streams and tables initialized successfully',
            results: {
                stream: streamResult,
                table: tableResult
            }
        });
    }
    catch (error) {
        console.error('Error initializing ksqlDB:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to initialize ksqlDB'
        });
    }
};
exports.initializeKsqlDB = initializeKsqlDB;
/**
 * Execute a pull query against ksqlDB
 * @param req Express request
 * @param res Express response
 */
const executePullQuery = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            res.status(400).json({ error: 'Query is required' });
            return;
        }
        const result = await ksqldb_service_1.ksqlDBService.pullQuery(query);
        res.status(200).json({
            success: true,
            result
        });
    }
    catch (error) {
        console.error('Error executing pull query:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to execute pull query'
        });
    }
};
exports.executePullQuery = executePullQuery;
/**
 * Get the latest message for a specific ID
 * @param req Express request
 * @param res Express response
 */
const getLatestMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: 'ID is required' });
            return;
        }
        const query = `SELECT * FROM messages_table WHERE ROWKEY='${id}';`;
        const result = await ksqldb_service_1.ksqlDBService.pullQuery(query);
        res.status(200).json({
            success: true,
            id,
            result
        });
    }
    catch (error) {
        console.error(`Error getting latest message for ID ${req.params.id}:`, error);
        res.status(500).json({
            success: false,
            error: `Failed to get latest message for ID ${req.params.id}`
        });
    }
};
exports.getLatestMessageById = getLatestMessageById;
/**
 * Execute a custom ksqlDB statement
 * @param req Express request
 * @param res Express response
 */
const executeStatement = async (req, res) => {
    try {
        const { statement } = req.body;
        if (!statement) {
            res.status(400).json({ error: 'Statement is required' });
            return;
        }
        const result = await ksqldb_service_1.ksqlDBService.executeStatement(statement);
        res.status(200).json({
            success: true,
            result
        });
    }
    catch (error) {
        console.error('Error executing statement:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to execute statement'
        });
    }
};
exports.executeStatement = executeStatement;
