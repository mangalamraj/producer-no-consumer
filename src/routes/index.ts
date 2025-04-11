import { Router } from 'express';
import kafkaRoutes from "./kafka.routes"
import ksqldbRoutes from "./ksqldb.routes"

const router = Router();

// Register routes
router.use('/api/kafka', kafkaRoutes);
router.use('/api/ksqldb', ksqldbRoutes);

export default router; 