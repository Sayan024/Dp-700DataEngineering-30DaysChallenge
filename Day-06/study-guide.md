# Day 06 Study Guide — Ingest & Transform Streaming Data (Real-Time Intelligence)

> **DP-700 Domain:** Ingest and transform data (30–35%)
> **Skills covered:**
> - Choose an appropriate streaming engine
> - Choose between native tables and OneLake shortcuts in Real-Time Intelligence
> - Choose between Query acceleration for OneLake shortcuts and standard OneLake shortcuts in Real-Time Intelligence
> - Process data by using Eventstreams
> - Process data by using Spark structured streaming
> - Process data by using KQL
> - Create windowing functions (Tumbling, Hopping, Sliding, Session)

---

## 🎯 What You Must Know for DP-700

Streaming and real-time processing are core components of Microsoft Fabric under **Real-Time Intelligence (RTI)**.
The exam tests your understanding of:
1. **Streaming Engines**: Eventstreams vs KQL Database vs Spark Structured Streaming
2. **Windowing Functions**: Tumbling vs Hopping vs Sliding vs Session windows
3. **OneLake Shortcuts vs Native Tables in RTI**: Storage and query acceleration decisions
4. **Processing Methods**: Eventstream transformations vs KQL update policies vs Spark streaming

---

## 📘 Section 1: Streaming Engines in Microsoft Fabric

| Engine | Primary Purpose | Latency | Processing Language | Best Use Case |
|---|---|---|---|---|
| **Fabric Eventstreams** | Low-code stream ingestion & routing | Milliseconds | Drag-and-drop / No-code | Ingesting Azure Event Hubs, IoT Hub, Kafka into Lakehouse/KQL DB |
| **KQL Database (Eventhouse)** | High-throughput time-series storage & analytics | Sub-second | KQL (Kusto Query Language) | Telemetry, log analytics, real-time dashboards |
| **Spark Structured Streaming** | Complex stream processing & micro-batching | Seconds (micro-batch) | PySpark / Scala / SQL | Stateful stream join, Delta Lake ACID streaming, ML on streams |

---

## 📘 Section 2: Windowing Functions Explained (Exam Essential)

Windowing functions aggregate streaming events over time windows.

### 1. Tumbling Window (Fixed, Non-overlapping)
- Fixed duration (e.g., every 5 minutes).
- Events belong to **exactly one window**.
- Example: Total website clicks from 10:00–10:05, 10:05–10:10.

```sql
-- KQL Tumbling Window
EventTable
| summarize ClickCount = count() by bin(Timestamp, 5m)
```

### 2. Hopping Window (Fixed, Overlapping / Sliding Step)
- Fixed duration, but moves forward by a smaller step (hop).
- Example: 10-minute window that updates every 2 minutes.
- Events belong to **multiple windows**.

```python
# PySpark Hopping Window
df.groupBy(window(df.timestamp, "10 minutes", "2 minutes"), df.device_id).count()
```

### 3. Sliding Window (Event-Driven Overlapping)
- Evaluates output only when an event occurs or condition changes within a duration.
- Looks back a specified time frame from the current event.

### 4. Session Window (Gap-based Activity)
- Groups events based on periods of activity.
- Closes when no new events arrive for a specified gap duration (e.g., user inactive for 15 minutes).

---

## 📘 Section 3: Eventstreams Deep Dive

### Sources
- Azure Event Hubs, Azure IoT Hub, Custom App (SDK/REST API), Sample Data, CDC (Azure SQL / PostgreSQL / MySQL)

### Destinations
- KQL Database (Eventhouse), Lakehouse (Delta table), Reflex (Activator item), Custom Endpoint

### In-Stream Transformations
- **Filter**: Drop unwanted records
- **Manage fields**: Rename, drop, or project columns
- **Aggregate**: Tumbling/Hopping windows in Eventstream UI without code
- **Group By**: Group streaming data by keys before writing to sink

---

## 📘 Section 4: KQL & Real-Time Intelligence Storage Patterns

### Native Tables vs OneLake Shortcuts in RTI

| Mode | Storage Location | Query Performance | Use Case |
|---|---|---|---|
| **Native Table** | KQL Engine SSD cache + Hot/Cold storage | Sub-second (fastest) | High-concurrency, interactive dashboards |
| **Standard OneLake Shortcut** | OneLake (Delta Parquet) | Standard Parquet scan | Querying historical Delta data in KQL without copying |
| **Shortcut with Query Acceleration** | OneLake + KQL Index Cache | Near-native KQL speed | Accelerating historical Delta analytical queries |

---

## 📘 Section 5: Spark Structured Streaming & Delta Lake

Spark processes streams using the **Micro-batch architecture** or **Continuous Processing**.

```python
# Read streaming data from OneLake Files / Event Hubs
streaming_df = spark.readStream \
    .format("delta") \
    .load("Files/bronze/events")

# Transform & Write continuously to Silver Delta Table
query = streaming_df \
    .filter("status == 'ERROR'") \
    .writeStream \
    .format("delta") \
    .outputMode("append") \
    .option("checkpointLocation", "Files/checkpoints/err_events") \
    .table("silver.error_logs")
```

### Output Modes
- **Append** (Default): Only new rows written to sink.
- **Complete**: Entire updated aggregate table written every trigger.
- **Update**: Only updated rows written to sink.

---

## 📝 3 DP-700 Practice Questions

### Question 1
You need to ingest real-time IoT telemetry from Azure Event Hubs, filter out invalid sensor readings, calculate 5-minute non-overlapping average temperatures, and output to a Lakehouse Delta table without writing code. Which tool should you use?

- A) Spark Structured Streaming in a PySpark Notebook
- B) Fabric Eventstream with in-stream transformation
- C) Dataflow Gen2 with scheduled refresh
- D) Data Pipeline with Copy Activity

> **Answer: B** — Fabric Eventstream supports no-code ingestion, filtering, Tumbling window aggregations, and direct output to Lakehouse Delta tables in real-time.

---

### Question 2
A data engineer needs to query 10 TB of historical Delta lake data stored in OneLake using KQL Queryset without copying data into KQL storage. The query must achieve sub-second execution speeds. Which option should be selected?

- A) Create a KQL Native Table and import historical data
- B) Create a standard OneLake Shortcut in KQL Database
- C) Create a OneLake Shortcut in KQL Database with Query Acceleration enabled
- D) Export Delta data to CSV and query using T-SQL

> **Answer: C** — OneLake Shortcut with Query Acceleration provides high-speed KQL querying on Delta data in OneLake by leveraging KQL index caching without duplicating storage.

---

### Question 3
Which windowing function will aggregate data in 10-minute intervals that recalculate every 2 minutes?

- A) Tumbling window
- B) Hopping window
- C) Session window
- D) Sliding window

> **Answer: B** — A Hopping window has a fixed duration (10 mins) and a smaller hop step (2 mins), resulting in overlapping windows.

---

## 🔗 Official Microsoft Learn References
- [Overview of Fabric Eventstreams](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/eventstreams/overview)
- [Real-Time Intelligence in Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/overview)
- [Windowing functions in Eventstreams](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/eventstreams/transform-eventstream)
- [DP-700 Study Guide](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/dp-700)
