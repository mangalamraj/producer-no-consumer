#!/bin/bash

# This script initializes ksqlDB streams and tables for the application

# Define variables
KSQLDB_SERVER="http://localhost:8088"
KAFKA_TOPIC="my-topic"

# Create the topic
echo "Creating Kafka topic: $KAFKA_TOPIC"
docker exec broker kafka-topics --create --topic $KAFKA_TOPIC --bootstrap-server broker:9092 --partitions 1 --replication-factor 1

# Wait for ksqlDB to be ready
echo "Waiting for ksqlDB server to be ready..."
until curl -s -o /dev/null -w "%{http_code}" $KSQLDB_SERVER/info | grep 200 > /dev/null; do
  echo "Waiting for ksqlDB server..."
  sleep 2
done

# Create the stream
echo "Creating ksqlDB stream from topic: $KAFKA_TOPIC"
curl -X POST $KSQLDB_SERVER/ksql \
  -H "Content-Type: application/vnd.ksql.v1+json" \
  -d '{
    "ksql": "CREATE STREAM IF NOT EXISTS messages_stream (id STRING KEY, message STRING, timestamp BIGINT) WITH (KAFKA_TOPIC='"'"''"$KAFKA_TOPIC"'''"'"', VALUE_FORMAT='"'"'JSON'"'"');",
    "streamsProperties": {}
  }'

# Create the table (materialized view)
echo "Creating ksqlDB materialized view"
curl -X POST $KSQLDB_SERVER/ksql \
  -H "Content-Type: application/vnd.ksql.v1+json" \
  -d '{
    "ksql": "CREATE TABLE IF NOT EXISTS messages_table AS SELECT id, LATEST_BY_OFFSET(message) AS latest_message, COUNT(*) AS message_count FROM messages_stream GROUP BY id EMIT CHANGES;",
    "streamsProperties": {}
  }'

echo "ksqlDB setup completed!" 