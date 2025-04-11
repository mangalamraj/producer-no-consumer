import { Router } from 'express';
import { produceMessage, produceMessageToTopic, produceBatchMessages } from '../controllers/kafka.controller';

const router = Router();

// Routes for Kafka producer operations
router.post('/produce', produceMessage);
router.post('/produce/:topic', produceMessageToTopic);
router.post('/produce-batch', produceBatchMessages);

export default router; 