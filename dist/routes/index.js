"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kafka_routes_1 = __importDefault(require("./kafka.routes"));
const ksqldb_routes_1 = __importDefault(require("./ksqldb.routes"));
const router = (0, express_1.Router)();
// Register routes
router.use('/api/kafka', kafka_routes_1.default);
router.use('/api/ksqldb', ksqldb_routes_1.default);
exports.default = router;
