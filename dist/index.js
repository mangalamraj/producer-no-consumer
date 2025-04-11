"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const routes_1 = __importDefault(require("./routes"));
const kafka_service_1 = require("./services/kafka.service");
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Register routes
app.use(routes_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Start the server
app.listen(config_1.config.server.port, async () => {
    console.log(`Server running on port ${config_1.config.server.port} in ${config_1.config.server.env} mode`);
    try {
        // Connect to Kafka broker
        await kafka_service_1.kafkaService.connect();
        console.log('Connected to Kafka broker');
        // Add shutdown handler
        process.on('SIGINT', async () => {
            console.log('Shutting down...');
            await kafka_service_1.kafkaService.disconnect();
            process.exit(0);
        });
    }
    catch (error) {
        console.error('Failed to start services:', error);
        process.exit(1);
    }
});
exports.default = app;
