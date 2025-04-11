"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.produceBatchMessages = exports.produceMessageToTopic = exports.produceMessage = void 0;
const kafka_service_1 = require("../services/kafka.service");
const config_1 = require("../config");
/**
 * Send a message to the default Kafka topic
 * @param req Express request
 * @param res Express response
 */
const produceMessage = async (req, res) => {
    try {
        const { message, key } = req.body;
        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }
        await kafka_service_1.kafkaService.sendMessage(config_1.config.kafka.topic, message, key);
        res.status(200).json({
            success: true,
            topic: config_1.config.kafka.topic,
            message: 'Message produced successfully'
        });
    }
    catch (error) {
        console.error('Error producing message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to produce message'
        });
    }
};
exports.produceMessage = produceMessage;
/**
 * Send a message to a specified Kafka topic
 * @param req Express request
 * @param res Express response
 */
const produceMessageToTopic = async (req, res) => {
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
        await kafka_service_1.kafkaService.sendMessage(topic, message, key);
        res.status(200).json({
            success: true,
            topic,
            message: 'Message produced successfully'
        });
    }
    catch (error) {
        console.error('Error producing message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to produce message'
        });
    }
};
exports.produceMessageToTopic = produceMessageToTopic;
/**
 * Send batch messages to the default Kafka topic
 * @param req Express request
 * @param res Express response
 */
const produceBatchMessages = async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            res.status(400).json({ error: 'Messages array is required' });
            return;
        }
        await kafka_service_1.kafkaService.sendBatchMessages(config_1.config.kafka.topic, messages);
        res.status(200).json({
            success: true,
            topic: config_1.config.kafka.topic,
            count: messages.length,
            message: 'Batch messages produced successfully'
        });
    }
    catch (error) {
        console.error('Error producing batch messages:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to produce batch messages'
        });
    }
};
exports.produceBatchMessages = produceBatchMessages;
