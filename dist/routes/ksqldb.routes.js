"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ksqldb_controller_1 = require("../controllers/ksqldb.controller");
const router = (0, express_1.Router)();
// Routes for ksqlDB operations
router.post('/initialize', ksqldb_controller_1.initializeKsqlDB);
router.post('/query', ksqldb_controller_1.executePullQuery);
router.get('/messages/:id', ksqldb_controller_1.getLatestMessageById);
router.post('/statement', ksqldb_controller_1.executeStatement);
exports.default = router;
