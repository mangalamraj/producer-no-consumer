"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kafka_controller_1 = require("../controllers/kafka.controller");
const router = (0, express_1.Router)();
// Routes for Kafka producer operations
router.post('/produce', kafka_controller_1.produceMessage);
router.post('/produce/:topic', kafka_controller_1.produceMessageToTopic);
router.post('/produce-batch', kafka_controller_1.produceBatchMessages);
exports.default = router;
