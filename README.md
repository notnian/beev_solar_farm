# Beev 🐝 - solar farm ☀️

You may have noticed that even though I'm proficient in Nest.js and TypeScript, I didn't choose that solution here because it's too much for the needed solution. So, in order to quickly proceed and have something lightweight, I opted for Express and vanilla JavaScript.

## Getting started

To install packages

```bash
npm install
```

To run the database

```bash
npm run database
```

To run the project in dev mode

```bash
npm run dev
```

## C. How to improve the solution

Here's a high-level design that can easily evolve and manage historical data. I've also identified the main areas for improvement. The main challenges when implementing this type of solution are managing high data volumes, latency in real-time processing, synchronizing data between different parts of the system, managing scalability and guaranteeing system availability and reliability.

Here are a few improvements:

### Database

We should start with a database more suitable for recording high-frequency values. SQLite is used in the provided example, but we can consider using a more robust database like PostgreSQL or MySQL, or perhaps a time-series database like InfluxDB (https://www.influxdata.com/).

### System Architecture

We can go with a microservices architecture where each functionality is handled by a separate service. This allows independent scalability of different parts of the system. It can be easily done using the Nest.js framework.

### Real-Time Data Collection

If you want to handle real-time updates, we need to establish a mechanism to collect and process data from the solar farm sensors in real-time. This can be achieved by using appropriate communication protocols such as MQTT (standard messaging protocol for the Internet of Things) or WebSocket.

### Historical Data Storage

To manage historical data, we can use long-term storage mechanisms such as block storage or cloud storage services. It is straightforward with services like AWS S3 and S3 Glacier.

### Data Processing and Analysis

For data analysis, we can consider using tools like Apache Spark or Apache Flink (I haven't used them personally, but I'm basing this on my research), which provide capabilities for distributed processing and real-time stream processing. This will enable processing of data in real-time, generating forecasts, and finding maximum values for consecutive subsets of values.

### Horizontal Scalability

To handle increased load and data, it's essential to ensure that the system can be easily horizontally scaled. This means that you can add new compute, storage, or processing nodes to the system without service interruption.

### Security

Appropriate security mechanisms should be added to protect data, communications, and system access. This includes authentication, authorization, and encryption of sensitive data.
