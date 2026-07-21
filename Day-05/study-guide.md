# Day 05 Study Guide — Ingest & Transform Data: Loading Patterns & Pipelines Deep Dive

> **DP-700 Domain:** Ingest and transform data (30–35%)
> **Skills covered:**
> - Design and implement full and incremental data loads
> - Prepare data for loading into a dimensional model
> - Ingest data by using pipelines
> - Choose an appropriate data store
> - Create and manage OneLake shortcuts
> - Implement mirroring
> - Handle duplicate, missing, and late-arriving data

---

## 🎯 What You Must Know for DP-700

The "Ingest and transform data" domain is **30–35% of the exam** — the largest single domain alongside the other two. The exam specifically tests:
1. **Full vs Incremental load design** — when to use each, and how watermarks work
2. **Copy Activity configuration** in Data Pipelines — source, sink, mappings
3. **Choosing the right data store** — Lakehouse vs Warehouse vs KQL Database vs Eventhouse
4. **OneLake Shortcuts vs Mirroring** — a classic exam distinction
5. **Handling bad data** — duplicates, nulls, late-arriving records

---

## 📘 Section 1: Full vs Incremental Loads

### Full Load
Truncates the target and reloads **all** source data on every run.

| Pros | Cons |
|---|---|
| Simple to implement | Expensive for large tables |
| Always consistent | Long run time |
| No watermark tracking needed | High network/compute cost |

**When to use:** Small reference/dimension tables, initial historical loads, source that doesn't support change tracking.

### Incremental Load (Delta / Watermark)
Only loads **new or changed records** since the last run. Requires a **watermark** — a column like `modified_date` or an auto-increment `id`.

```python
# PySpark incremental pattern
last_watermark = spark.sql("SELECT MAX(load_date) FROM silver.orders").collect()[0][0]

new_data = spark.read.format("delta").load("Files/bronze/orders") \
    .filter(col("modified_date") > last_watermark)

new_data.write.format("delta").mode("append").save("Tables/silver_orders")
```

| Pros | Cons |
|---|---|
| Fast and efficient | Needs reliable watermark column |
| Lower cost | Doesn't catch deletes by default |
| Scales to large tables | Missed records if watermark skipped |

**When to use:** Large transactional tables, regular scheduled loads, source with `last_modified` or CDC support.

### Change Data Capture (CDC) / Mirroring
Captures **inserts, updates, AND deletes** from the source at the database log level.

**In Fabric:** Use **Mirroring** for real-time CDC from Azure SQL DB, Cosmos DB, Snowflake, and more — no pipeline needed.

---

## 📘 Section 2: Loading Into a Dimensional Model

Before loading into a star schema (fact + dimension tables), you must prepare data:

| Step | Action | Tool |
|---|---|---|
| **1. Denormalize** | Flatten normalized source tables | PySpark JOIN, T-SQL |
| **2. Deduplicate** | Remove exact/soft duplicates | `dropDuplicates()`, `ROW_NUMBER()` |
| **3. Surrogate keys** | Generate integer PKs for dimensions | `monotonically_increasing_id()` |
| **4. Handle nulls** | Fill or reject missing values | `fillna()`, `COALESCE()` |
| **5. SCD Type 2** | Track historical dimension changes | Add `valid_from`, `valid_to`, `is_current` |
| **6. Load fact table** | Look up surrogate keys, write aggregated facts | PySpark, T-SQL |

### SCD Type 2 Pattern (Exam Favourite)
```python
# Merge existing dimension with new data
from delta.tables import DeltaTable

dim_table = DeltaTable.forName(spark, "gold.dim_customer")
dim_table.alias("target").merge(
    new_data.alias("source"),
    "target.customer_id = source.customer_id AND target.is_current = true"
).whenMatchedUpdate(
    condition="source.email != target.email",
    set={"is_current": "false", "valid_to": "current_date()"}
).whenNotMatchedInsert(values={...}).execute()
```

---

## 📘 Section 3: Copy Activity in Data Pipelines

The **Copy Activity** is the primary data ingestion mechanism in Fabric Data Pipelines.

### Key Configuration Areas

| Component | What It Does |
|---|---|
| **Source** | Connection, query/table, file format, partition options |
| **Sink** | Destination store, write behaviour (append/overwrite/upsert) |
| **Mapping** | Column-to-column schema mapping, data type conversions |
| **Settings** | Parallelism, fault tolerance, logging |

### Write Behaviours (Sink)

| Mode | Behaviour | Use When |
|---|---|---|
| **Append** | Adds new rows, keeps existing | Incremental loads to Lakehouse |
| **Overwrite** | Truncates then writes | Full load to Lakehouse table |
| **Upsert** | Insert new, update existing | SCD Type 1, merge patterns |
| **Insert** | Insert only, fails on duplicate key | Warehouse fact table loads |

---

## 📘 Section 4: Choose the Right Data Store

| Scenario | Best Store | Why |
|---|---|---|
| Large-scale analytics with PySpark | **Lakehouse** | Delta Lake, Spark-native, OneLake |
| SQL-first analytics, structured schema | **Data Warehouse** | T-SQL, ACID, optimized for SQL queries |
| Real-time telemetry, time-series | **Eventhouse (KQL DB)** | Sub-second query on billions of rows |
| Mixed batch + streaming | **Lakehouse + Eventstream** | Unified OneLake storage |
| BI semantic model refresh | **Lakehouse or Warehouse** | Both support DirectLake and DirectQuery |

### Exam Trap ⚠️
> **Lakehouse vs Warehouse:** A Lakehouse stores data as Delta Parquet files in OneLake and uses Spark for processing. A Warehouse uses a SQL engine with columnar storage optimised for T-SQL queries. A Lakehouse has both a SQL Analytics Endpoint (read-only T-SQL) AND a Spark interface. A Warehouse only has T-SQL.

---

## 📘 Section 5: OneLake Shortcuts vs Mirroring

Two ways to bring external data into Fabric **without copying it:**

### OneLake Shortcuts
- Creates a **virtual pointer** to data in ADLS Gen2, S3, GCS, or another Lakehouse
- Data stays in the external location — **no physical copy**
- Read-only by default
- Supports Delta format, Parquet, CSV etc.
- Authentication: User identity passthrough OR delegated credentials (service principal)

### Mirroring
- Creates a **continuously synchronized replica** inside OneLake
- Supports: Azure SQL DB, Azure Cosmos DB, Snowflake, Azure SQL Managed Instance
- Data IS physically replicated into OneLake in Delta format
- Near real-time replication via CDC
- Enables full Fabric analytics (Spark, SQL endpoint, Power BI) on mirrored data

| | Shortcut | Mirroring |
|---|---|---|
| Data location | External (pointer only) | Replicated into OneLake |
| Latency | Depends on external source | Near real-time (CDC) |
| Write support | No (read-only) | No (read-only in Fabric) |
| Best for | ADLS/S3/GCS data in-place | Azure SQL / Cosmos DB replication |
| Supported sources | ADLS, S3, GCS, Lakehouse | Azure SQL, Cosmos DB, Snowflake |

---

## 📘 Section 6: Handle Duplicate, Missing & Late-Arriving Data

### Duplicates
```python
# Exact duplicates
df_clean = df.dropDuplicates()

# Soft duplicates — keep latest by key
from pyspark.sql.window import Window
from pyspark.sql.functions import row_number, desc

w = Window.partitionBy("order_id").orderBy(desc("modified_date"))
df_deduped = df.withColumn("rn", row_number().over(w)).filter("rn = 1").drop("rn")
```

### Missing / Null Values
```python
# Fill nulls with defaults
df = df.fillna({"revenue": 0, "region": "Unknown", "status": "Pending"})

# Drop rows where key columns are null
df = df.dropna(subset=["customer_id", "order_date"])

# T-SQL equivalent
SELECT COALESCE(revenue, 0), ISNULL(region, 'Unknown') FROM orders
```

### Late-Arriving Data
Late data arrives **after its event time window has already been processed**.

**Solutions:**
- **Watermark tolerance** (Spark Structured Streaming): `withWatermark("event_time", "2 hours")` — accept late records up to 2 hours late
- **Reprocessing**: Re-run the affected pipeline window when late data arrives
- **SCD Type 2**: Late dimension changes tracked with `valid_from`/`valid_to`

---

## 📝 3 DP-700 Practice Questions

### Question 1
A Fabric pipeline runs daily loading 50 million new transaction records. The source Azure SQL database has a `last_modified_utc` column. Which load strategy minimises pipeline run time while ensuring completeness?

- A) Full load — truncate and reload all 50 million rows daily
- B) Incremental load using `last_modified_utc` as a watermark
- C) Mirroring from Azure SQL DB to replicate all changes in real time
- D) OneLake shortcut pointing to the Azure SQL DB

> **Answer: B** — Incremental load with `last_modified_utc` watermark only processes changed rows, minimising cost and time. C is also valid for near-real-time but the question specifies a daily pipeline. A is expensive. D — shortcuts don't support Azure SQL DB (only ADLS/S3/GCS/Lakehouse).

---

### Question 2
You need to bring Snowflake data into Microsoft Fabric for Power BI reporting with near-real-time freshness. Which approach is MOST appropriate?

- A) OneLake Shortcut to Snowflake
- B) Data Pipeline with Copy Activity on a 15-minute schedule
- C) Fabric Mirroring of Snowflake
- D) Dataflow Gen2 refreshing every 15 minutes

> **Answer: C** — Fabric Mirroring supports Snowflake and provides near-real-time CDC replication into OneLake in Delta format. A — Shortcuts don't support Snowflake as a source. B and D work but are batch, not near-real-time.

---

### Question 3
A dimension table needs to track historical changes — when a customer's email changes, the old record must be preserved with an end date. Which pattern should be implemented?

- A) SCD Type 1 — overwrite the old value
- B) SCD Type 2 — add a new row with valid_from, valid_to, and is_current flag
- C) Full load — reload the entire dimension daily
- D) Append-only — add a new row without deactivating the old one

> **Answer: B** — SCD Type 2 preserves history by inserting a new record and expiring the old one with `valid_to` and `is_current = false`. Type 1 overwrites and loses history. Type C is inefficient. Type D creates duplicates without expiry logic.

---

## 🔗 Official Microsoft Learn References
- [Data ingestion in Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/data-factory/data-factory-overview)
- [Lakehouse in Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-overview)
- [Mirroring in Fabric](https://learn.microsoft.com/en-us/fabric/database/mirrored-database/overview)
- [OneLake shortcuts](https://learn.microsoft.com/en-us/fabric/onelake/onelake-shortcuts)
- [DP-700 Study Guide](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/dp-700)
