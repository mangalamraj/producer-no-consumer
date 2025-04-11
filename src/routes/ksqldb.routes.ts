import { Router } from 'express';
import { 
  initializeKsqlDB,
  executePullQuery,
  getLatestMessageById,
  executeStatement
} from '../controllers/ksqldb.controller';

const router = Router();

// Routes for ksqlDB operations
router.post('/initialize', initializeKsqlDB);
router.post('/query', executePullQuery);
router.get('/messages/:id', getLatestMessageById);
router.post('/statement', executeStatement);

export default router; 