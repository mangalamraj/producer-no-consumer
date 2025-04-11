"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaService = void 0;
const kafkajs_1 = require("kafkajs");
const config_1 = require("../config");
class KafkaService {
    constructor() {
        this.isConnected = false;
        const kafka = new kafkajs_1.Kafka({
            clientId: config_1.config.kafka.clientId,
            brokers: config_1.config.kafka.brokers
        });
        this.producer = kafka.producer();
    }
    /**
     * Connect to Kafka broker
     */
    async connect() {
        if (!this.isConnected) {
            try {
                await this.producer.connect();
                this.isConnected = true;
                console.log('Connected to Kafka broker');
            }
            catch (error) {
                console.error('Failed to connect to Kafka broker:', error);
                throw error;
            }
        }
    }
    /**
     * Disconnect from Kafka broker
     */
    async disconnect() {
        if (this.isConnected) {
            try {
                await this.producer.disconnect();
                this.isConnected = false;
                console.log('Disconnected from Kafka broker');
            }
            catch (error) {
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
    async sendMessage(topic, message, key) {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            const record = {
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
        }
        catch (error) {
            console.error(`Failed to send message to topic ${topic}:`, error);
            throw error;
        }
    }
    /**
     * Send multiple messages to a Kafka topic
     * @param topic Kafka topic
     * @param messages Array of messages to send
     */
    async sendBatchMessages(topic, messages) {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            const record = {
                topic,
                messages: messages.map(msg => ({
                    key: msg.key || String(Date.now()),
                    value: typeof msg.value === 'string' ? msg.value : JSON.stringify(msg.value)
                }))
            };
            await this.producer.send(record);
            console.log(`Batch of ${messages.length} messages sent to topic ${topic}`);
        }
        catch (error) {
            console.error(`Failed to send batch messages to topic ${topic}:`, error);
            throw error;
        }
    }
}
// Export a singleton instance
exports.kafkaService = new KafkaService();
