# 📚 DP-700 Day 02 Study Guide: Spark Workspace Settings & Custom Pools

> **Author:** Sayan Banerjee (Fabric Data Engineer Associate DP-700 Certified)  
> **Topic:** Day 02 / 30 — Spark Workspace Settings, Custom Pools, High Concurrency, Native Execution Engine & Environment Items  
> **Target Exam:** Microsoft Certified: Fabric Data Engineer Associate (Exam DP-700)

---

## 🎯 1. DP-700 Exam Objectives Covered

This study guide directly maps to **Domain 1: Implement and Manage an Analytics Solution (30–35%)**:
*   **Configure Fabric Workspace Settings:** Configure Spark workspace settings, custom pools, starter pools, default runtimes, and high concurrency session sharing.
*   **Manage Library Dependencies:** Create and manage Environment items, specify PyPI/Conda libraries, and manage inline notebook installations.
*   **Optimize Compute Resources:** Configure auto-scale, auto-pause settings, and enable the Native Execution Engine (Velox) for high-performance Spark execution.

---

## 🏗️ 2. Fabric Spark Compute Architecture

Microsoft Fabric provides a managed Apache Spark compute platform. Unlike traditional Azure Synapse or Azure Databricks clusters that require extensive manual cluster creation, Fabric offers two primary pool architectures: **Starter Pools** and **Custom Pools**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FABRIC SPARK COMPUTE                            │
│                                                                        │
│   ┌────────────────────────────────┐  ┌─────────────────────────────┐  │
│   │        STARTER POOLS           │  │        CUSTOM POOLS        │  │
│   │                                │  │                             │  │
│   │  • Pre-warmed (~5-10s startup) │  │  • Custom Node Sizing       │  │
│   │  • Fully Managed by Fabric     │  │  • Cold Start (~2-3 mins)   │  │
│   │  • Dynamic Auto-Scale          │  │  • Configurable Auto-Pause  │  │
│   │  • Best for EDA & Quick Jobs   │  │  • Best for Heavy Batch ETL │  │
│   └────────────────────────────────┘  └─────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ 3. Starter Pools vs. Custom Pools: Deep Dive

### Starter Pools (Default Configuration)
Starter pools are pre-allocated, managed pools offered out-of-the-box by Microsoft Fabric.

*   **Fast Allocation:** Clusters start in **5 to 10 seconds** because compute nodes are pre-warmed in the background tenant capacity.
*   **Dynamic Scaling:** Automatically scales nodes up and down based on submitted workload pressure.
*   **No Maintenance:** Workspace admins do not need to configure node counts, RAM, or virtual cores manually.
*   **Ideal Use Cases:** Interactive data exploration, PySpark testing, short-running Data Factory pipeline activities, and ad-hoc analytics.

---

### Custom Pools
Custom pools allow workspace administrators to tailor node hardware, execution rules, and idle timeout behavior.

*   **Node Sizing Options:** Select from predefined node families:
    *   **Small:** 4 vCores, 32 GB RAM per node.
    *   **Medium:** 8 vCores, 64 GB RAM per node.
    *   **Large:** 16 vCores, 128 GB RAM per node.
    *   **X-Large:** 32 vCores, 256 GB RAM per node.
    *   **XX-Large:** 64 vCores, 512 GB RAM per node.
*   **Executor Limits:** Define minimum and maximum node allocation boundaries to enforce capacity limits.
*   **Auto-Pause Settings:** Configure the idle timeout (in minutes) after which inactive nodes release capacity (default is 2 minutes).
*   **Startup Latency:** Cold start latency is **2 to 3 minutes** as dedicated VMs are provisioned.
*   **Ideal Use Cases:** Heavy memory-bound batch ETL jobs, strict corporate capacity budgeting, or workload isolation requirements.

---

## 🔄 4. High Concurrency Mode & Session Sharing

By default, every PySpark Notebook execution provisions an isolated Spark session. In busy environments, this can consume excessive Capacity Units (CUs) and cause queuing.

### High Concurrency Session Sharing
High Concurrency mode allows **multiple notebooks and users to share a single active Spark cluster**.

```
┌─────────────────────────────────────────────────────────────┐
│                 Shared Spark Cluster (Session)             │
│                                                             │
│   ├── Notebook A (User 1 - Ingestion) ──────────────────┐   │
│   ├── Notebook B (User 2 - Transformation) ─────────────┼───│ Shared Engine
│   └── Notebook C (Pipeline Pipeline Task) ──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### Key Capabilities & Benefits:
1. **Zero Cold Start for Subsequent Jobs:** Notebook 2 attaches to Notebook 1's running cluster in under 1 second.
2. **User Isolation:** Variable namespaces and security contexts remain completely isolated between users.
3. **Pipeline Optimization:** Data Factory pipelines running multiple parallel notebook activities reuse the shared session automatically.

---

## 🚀 5. Native Execution Engine (Velox C++ Vectorization)

Microsoft Fabric includes the **Native Execution Engine**—a C++-based vectorized execution engine built on top of **Apache Velox**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SPARK PHYSICAL PLAN                             │
│                                                                        │
│   Standard Spark Engine (JVM)      Native Execution Engine (Velox)     │
│   ├── Java Bytecode Overhead       ├── Vectorized C++ Execution        │
│   ├── Garbage Collection Pauses    ├── Direct CPU SIMD Instructions    │
│   └── Standard Row/Column Read     └── Up to 4x Faster Aggregations    │
└────────────────────────────────────────────────────────────────────────┘
```

### How to Enable Native Execution Engine

#### Method 1: Programmatically in PySpark
```python
# Enable Native Execution Engine for current session
spark.conf.set("spark.native.enabled", "true")

# Verify Native Execution Operator in query plan
df = spark.read.format("delta").load("Tables/sales")
df_filtered = df.filter(df["total_amount"] > 1000).groupBy("region").count()
df_filtered.explain()  # Look for 'NativeScan' or 'Velox' operators
```

#### Method 2: Workspace Environment Item
Add `spark.native.enabled = true` under **Spark Properties** in a workspace **Environment** item.

#### Performance Gains:
*   Up to **4x performance improvement** on heavy join, aggregation, and filter operations.
*   Reduces memory footprint by bypassing Java Virtual Machine (JVM) garbage collection.

---

## 📦 6. Library Management & Environment Items

Managing Python dependencies (PyPI, Conda) across data engineering teams requires proper governance.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LIBRARY GOVERNANCE                              │
│                                                                        │
│   Environment Items (Recommended)     Inline %pip Commands (Ad-hoc)    │
│   ├── Reusable across Notebooks       ├── Scope: Current session only  │
│   ├── Version Controlled              ├── Adds startup delay per run   │
│   └── Pre-compiled in background      └── Best for temporary testing   │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Environment Items (Production Standard)
An **Environment** item is a dedicated Fabric artifact that defines custom Spark settings, PyPI/Conda libraries, and compute pools.

#### Example Conda Specification (YAML):
```yaml
name: fabric_data_engineering_env
channels:
  - conda-forge
dependencies:
  - python=3.10
  - pip:
      - azure-storage-blob==12.19.0
      - delta-spark==3.1.0
      - scikit-learn==1.4.0
```

### 2. Inline Notebook Installation (Development Only)
```python
# Temporary installation for current notebook execution
%pip install azure-storage-blob==12.19.0
```
> ⚠️ **Exam Note:** Avoid using inline `%pip install` in production scheduled pipelines because library compilation occurs every single time the pipeline triggers, wasting Capacity Units (CUs) and adding runtime latency.

---

## 📊 7. Monitoring & Telemetry (Spark UI)

When troubleshooting long-running Spark jobs in Fabric, use the built-in **Spark UI** and **Capacity Metrics App**.

### Key Spark Metrics to Monitor:

| Metric in Spark UI | Meaning / Root Cause | Remediation Strategy |
|---|---|---|
| **Spill (Memory / Disk)** | Spark partition size exceeds executor RAM; data spills to disk. | Upgrade to larger Custom Pool node size or increase `spark.sql.shuffle.partitions`. |
| **Data Skew** | One executor processes 90% of data while others sit idle. | Salting key, repartitioning, or enabling Adaptive Query Execution (`spark.sql.adaptive.skewedJoin.enabled`). |
| **Long Stage Duration** | Excessive shuffling or un-indexed scan operations. | Apply Delta **V-Order** or Liquid Clustering (`CLUSTER BY`). |

---

## ❓ 8. Practice DP-700 Exam Questions (Day 02 Focus)

### Question 1 (Scenario)
**Scenario:** A enterprise data engineering team has 15 PySpark notebooks executed concurrently via a Data Factory pipeline every hour. The current setup uses a Custom Pool with cold-start latency of 3 minutes per notebook, leading to pipeline SLA violations and high capacity consumption.

Which two actions should the Data Engineer take to reduce pipeline execution time and CU consumption? (Select TWO)

*   A) Enable High Concurrency mode for the workspace Spark sessions.
*   B) Replace the Custom Pool with Starter Pools for instant session allocation.
*   C) Add `%pip install` commands at the top of each notebook script.
*   D) Increase the auto-pause timeout on the Custom Pool to 60 minutes.
*   E) Disable Adaptive Query Execution (AQE) in Spark settings.

**Correct Answer:** **A and B**  
**Explanation:** Starter Pools pre-warm nodes and launch in 5–10 seconds (Option B), eliminating cold start delays. High Concurrency mode (Option A) allows multiple concurrent notebook activities to share a running Spark session, reducing startup overhead and CU consumption. Adding `%pip install` (Option C) increases latency, and increasing auto-pause timeout (Option D) wastes CU capacity.

---

### Question 2 (Scenario)
**Scenario:** A Data Engineer notices that a scheduled PySpark notebook performing a heavy aggregation join on a 2 TB Delta table takes 45 minutes to execute. The job runs on a Large Custom Pool. The engineer wants to accelerate query execution **without increasing cluster size or altering code logic**.

Which configuration change should be applied?

*   A) Set `spark.native.enabled` to `true` in the session or Environment configuration.
*   B) Set `spark.sql.shuffle.partitions` to `1`.
*   C) Change notebook default language to Scala.
*   D) Convert the Delta table to uncompressed CSV format.

**Correct Answer:** **A**  
**Explanation:** Setting `spark.native.enabled = true` activates Microsoft Fabric's Native Execution Engine (Velox C++ acceleration engine), which vectorizes operations and speeds up join/aggregation queries by up to 4x without requiring code changes or larger node hardware.

---

### Question 3 (Scenario)
**Scenario:** A lead data engineer needs to standardize Python library versions across 20 notebooks used by 8 data engineers in a shared workspace. The solution must ensure that scheduled production pipelines do not suffer runtime installation latency.

Which solution should the Data Engineer implement?

*   A) Add `%pip install` statements in the first cell of every notebook.
*   B) Create a Fabric Environment item, specify the required library versions, and set it as the default workspace environment.
*   C) Upload `.whl` files to the Lakehouse Files folder and reference them via `sys.path.append()`.
*   D) Ask each engineer to manually install packages on their local workstations.

**Correct Answer:** **B**  
**Explanation:** Fabric Environment items allow centralized management of Python/Conda dependencies across a workspace. Setting an Environment item as workspace default guarantees version consistency and eliminates per-run inline compilation overhead.

---

## ✅ Day 02 Revision Checklist

Before proceeding to **Day 03 (OneLake Settings & Access Control)**, ensure you can answer:

- [ ] What is the startup time difference between Starter Pools and Custom Pools?
- [ ] What C++ vectorized engine provides up to 4x query acceleration in Fabric Spark?
- [ ] How do you programmatically enable the Native Execution Engine in PySpark?
- [ ] Why should inline `%pip install` commands be avoided in production pipelines?
- [ ] What does "Spill (Memory/Disk)" in the Spark UI signify, and how do you fix it?
