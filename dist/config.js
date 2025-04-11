"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
exports.config = {
    kafka: {
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
        topic: process.env.KAFKA_TOPIC || 'my-topic',
        clientId: 'producer-noconsumer',
    },
    ksqldb: {
        host: process.env.KSQLDB_HOST || 'localhost',
        port: process.env.KSQLDB_PORT || '8088',
        get url() {
            return `http://${this.host}:${this.port}`;
        }
    },
    server: {
        port: parseInt(process.env.PORT || '3000', 10),
        env: process.env.NODE_ENV || 'development',
    }
};
