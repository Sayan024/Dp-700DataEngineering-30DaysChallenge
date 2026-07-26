# Day 07 Study Guide — Transform Data with PySpark & Delta Lake Deep Dive

> **DP-700 Domain:** Ingest and transform data (30–35%) & Monitor and optimize an analytics solution (30–35%)
> **Skills covered:**
> - Transform data by using PySpark
> - Group and aggregate data
> - Denormalize data
> - Optimize a Lakehouse table (V-Order, OPTIMIZE, VACUUM)
> - Delta Lake ACID capabilities, Time Travel & Schema Evolution

---

## 🎯 What You Must Know for DP-700

PySpark combined with Delta Lake forms the core processing engine of Lakehouses in Microsoft Fabric.
The exam heavily tests:
1. **PySpark Transformations**: `.select()`, `.filter()`, `.withColumn()`, `.groupBy()`, `.agg()`, Window Functions
2. **Delta Lake Table Optimization**: V-Order (Fabric specific), `OPTIMIZE`, `VACUUM`, Z-ORDER
3. **Delta Features**: Time Travel (`VERSION AS OF` / `TIMESTAMP AS OF`), Schema Evolution (`mergeSchema`)
4. **Lakehouse Table Maintenance**: Small files compaction, retention periods, file management

---

## 📘 Section 1: Core PySpark Transformations

PySpark uses lazy evaluation — operations are either **Transformations** (lazy) or **Actions** (eager execution).

### Common PySpark Operations

```python
from pyspark.sql.functions import col, when, upper, row_number, sum, avg
from pyspark.sql.window import Window

# 1. Column transformation & conditional logic
df_transformed = df.withColumn("full_name", concat_ws(" ", col("first_name"), col("last_name"))) \
    .withColumn("status_flag", when(col("score") >= 80, "PASS").otherwise("FAIL"))

# 2. Aggregations
df_summary = df_transformed.groupBy("department") \
    .agg(
        sum("sales").alias("total_sales"),
        avg("score").alias("avg_score")
    )

# 3. Window Function (Soft Deduplication / Ranking)
window_spec = Window.partitionBy("customer_id").orderBy(col("updated_at").desc())
df_latest = df.withColumn("rank", row_number().over(window_spec)) \
    .filter("rank == 1") \
    .drop("rank")
```

---

## 📘 Section 2: Lakehouse Table Optimization (Fabric & Delta Lake)

Optimization is vital for read performance in Power BI DirectLake and T-SQL queries.

### 1. V-Order (Microsoft Fabric Secret Weapon)
- **What it is:** A Fabric-proprietary write-time optimization for Delta Parquet files.
- **Why it matters:** Provides lightning-fast in-memory reads for Power BI (DirectLake mode) and SQL Analytics Endpoint.
- **Enabled by default** in Fabric Spark environments. Can be set explicitly:
  ```python
  spark.conf.set("spark.sql.parquet.vorder.enabled", "true")
  ```

### 2. OPTIMIZE (Compaction)
- Merges thousands of small Parquet files into larger, uniform ~1 GB files.
- Reduces file scanning overhead.

```sql
-- T-SQL or Spark SQL
OPTIMIZE delta.`Tables/sales_gold` ZORDER BY (customer_id, order_date);
```

### 3. VACUUM (File Cleanup)
- Permanently removes uncommitted data files and historical files older than the retention period (default **7 days**).
- **Exam Caution ⚠️:** If you run `VACUUM` with default settings, you **cannot** time travel back beyond 7 days!

```sql
-- Remove old unreferenced files older than 7 days
VACUUM sales_gold;

-- Remove files older than 0 hours (requires disabling safety check)
SET spark.databricks.delta.vacuum.parallelDelete.enabled = true;
VACUUM sales_gold RETAIN 0 HOURS;
```

---

## 📘 Section 3: Delta Lake Time Travel & Schema Evolution

### Time Travel
Query previous snapshots of your Delta table using version numbers or timestamps.

```sql
-- Query by version
SELECT * FROM sales_gold VERSION AS OF 3;

-- Query by timestamp
SELECT * FROM sales_gold TIMESTAMP AS OF '2026-07-20 12:00:00';
```

### Schema Evolution (`mergeSchema`)
Allows new columns to be appended to a Delta table automatically without breaking existing schemas.

```python
new_df.write.format("delta") \
    .mode("append") \
    .option("mergeSchema", "true") \
    .saveAsTable("sales_gold")
```

---

## 📘 Section 4: Optimization Summary Table

| Technique | Action / Purpose | Fabric Specific? | Impact |
|---|---|---|---|
| **V-Order** | Custom sorting & indexing at write time | ✅ Yes (Fabric default) | Faster DirectLake & SQL queries |
| **OPTIMIZE** | Compact small files into ~1 GB chunks | No (Delta standard) | Reduces storage scan overhead |
| **Z-ORDER** | Co-locate related data in same files | No (Delta standard) | Data skipping on filtered columns |
| **VACUUM** | Delete old unreferenced physical files | No (Delta standard) | Cleans storage (limits Time Travel) |
| **Partitioning** | Divide table into folder paths by column | No (Standard) | Filter pruning on large tables (> 1 TB) |

---

## 📝 3 DP-700 Practice Questions

### Question 1
A data engineer notices that Power BI DirectLake reports querying a Lakehouse Delta table are running slower than expected. You want to ensure the Delta files are written with optimal row ordering and compression specifically for Fabric engines. What should you enable?

- A) Enable Auto-compact
- B) Enable V-Order in Spark settings
- C) Set VACUUM retention to 0 hours
- D) Convert Delta table to CSV

> **Answer: B** — V-Order is Microsoft Fabric's proprietary write-time optimization designed to maximize read performance for DirectLake and SQL endpoints.

---

### Question 2
You need to restore a Delta table to how it looked yesterday at 14:00 UTC after an accidental deletion of rows. However, a data engineer ran `VACUUM RETAIN 0 HOURS` 1 hour ago. What will happen when you attempt Time Travel?

- A) The table will successfully restore to yesterday's snapshot.
- B) Time travel will fail because physical historical files were permanently deleted by VACUUM.
- C) Time travel will succeed using Delta transaction log backups in Azure Blob.
- D) The table will automatically rebuild using V-Order.

> **Answer: B** — Running `VACUUM` physically deletes old Parquet files from storage. Once deleted, Time Travel queries to timestamps prior to the retention window will fail.

---

### Question 3
You have thousands of 2 MB Parquet files in your Lakehouse Delta table resulting in slow query performance due to the "small file problem". Which command will consolidate these into ~1 GB files?

- A) VACUUM
- B) OPTIMIZE
- C) V-Order Disable
- D) ALTER TABLE REBUILD

> **Answer: B** — `OPTIMIZE` performs file compaction, merging small files into larger, optimal size chunks (~1 GB).

---

## 🔗 Official Microsoft Learn References
- [Delta Lake table optimization and V-Order](https://learn.microsoft.com/en-us/fabric/data-engineering/delta-optimization-and-v-order)
- [PySpark in Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/data-engineering/pyspark-overview)
- [DP-700 Study Guide](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/dp-700)
