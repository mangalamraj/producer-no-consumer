# Kafka Producer with ksqlDB Integration

This project demonstrates how to use ksqlDB to process Kafka messages without directly using Kafka consumers in your application.

## Architecture

The application consists of:

1. **Kafka Producer**: Node.js service that produces messages to Kafka topics
2. **ksqlDB**: Stream processing engine that creates streams and materialized views from Kafka topics
3. **REST API**: Endpoints to interact with Kafka and ksqlDB

## Prerequisites

- Node.js 16+ and npm/pnpm
- Kafka cluster (local or remote)
- ksqlDB server connected to your Kafka cluster

## Setup

### 1. Install dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure environment variables

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Edit the `.env` file to point to your Kafka and ksqlDB servers.

### 3. Start Kafka and ksqlDB (if running locally)

You can use Docker Compose to start a local Kafka cluster with ksqlDB:

```bash
docker-compose up -d
```

(Note: Docker Compose file is not included in this repository)

## Running the Application

### Development mode

```bash
npm run dev
# or
pnpm dev
```

### Production mode

```bash
npm run build
npm start
# or
pnpm build
pnpm start
```

## API Endpoints

### Kafka Producer

- `POST /api/kafka/produce`: Produce a message to the default topic
  ```json
  {
    "message": "Hello, world!",
    "key": "my-key" // optional
  }
  ```

- `POST /api/kafka/produce/:topic`: Produce a message to a specific topic
  ```json
  {
    "message": "Hello, world!",
    "key": "my-key" // optional
  }
  ```

- `POST /api/kafka/produce-batch`: Produce multiple messages to the default topic
  ```json
  {
    "messages": [
      { "value": "Message 1", "key": "key1" },
      { "value": "Message 2", "key": "key2" }
    ]
  }
  ```

### ksqlDB Integration

- `POST /api/ksqldb/initialize`: Initialize ksqlDB streams and tables
  ```json
  {}
  ```

- `POST /api/ksqldb/query`: Execute a pull query
  ```json
  {
    "query": "SELECT * FROM messages_table WHERE ROWKEY='my-key';"
  }
  ```

- `GET /api/ksqldb/messages/:id`: Get the latest message for a specific ID

- `POST /api/ksqldb/statement`: Execute a custom ksqlDB statement
  ```json
  {
    "statement": "CREATE STREAM IF NOT EXISTS custom_stream (id STRING KEY, value STRING) WITH (KAFKA_TOPIC='custom-topic', VALUE_FORMAT='JSON');"
  }
  ```

## How It Works

1. The application sends messages to Kafka topics using the Kafka producer
2. ksqlDB reads these messages and processes them into streams and tables
3. The application queries ksqlDB to get the latest state or processed results
4. No direct Kafka consumer is used in the application code

## Benefits of Using ksqlDB

1. No need to implement and manage Kafka consumers in your application
2. SQL-like queries for streaming data
3. Materialized views that update in real-time
4. Scalable and fault-tolerant processing

## License

ISC 