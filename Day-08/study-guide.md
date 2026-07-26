# Day 08 Study Guide — Monitor & Optimize Fabric Solutions

> **DP-700 Domain:** Monitor and optimize an analytics solution (30–35%)
> **Skills covered:**
> - Configure Spark workspace settings (Spark pools, custom pools, starter pools)
> - Optimize Spark performance (executors, dynamic allocation)
> - Monitor capacity utilization & Capacity Metrics App
> - Identify and resolve errors (pipeline, notebook, warehouse, dataflow errors)
> - Monitor Fabric items (data ingestion, data transformation)

---

## 🎯 What You Must Know for DP-700

Monitoring and Optimization constitutes **30–35% of the DP-700 exam**. You must master:
1. **Spark Configurations**: Starter pools vs Custom pools, sizing nodes, dynamic allocation.
2. **Monitoring Tools**: Monitoring Hub, Spark UI, capacity metrics.
3. **Microsoft Fabric Capacity Metrics App**: Interactive billing, execution times, CU (Capacity Unit) utilization, throttling, smoothing (interactive vs background operations).
4. **Error Isolation**: Pinpointing pipeline, notebook, and warehouse errors.

---

## 📘 Section 1: Spark Pool & Performance Optimization

In Microsoft Fabric, Spark compute can be configured using starter pools or custom pools.

### 1. Starter Pools
- **What they are:** Default, serverless pools provided by Fabric.
- **Warm start:** Offers sub-second startup times because virtual machines are pre-warmed.
- **Sizing:** Scales automatically based on the Fabric capacity node sizes.

### 2. Custom Pools
- **What they are:** Pools you define manually at the workspace level.
- **Cold start:** Higher latency (~1-3 minutes) because nodes are allocated on demand.
- **When to use:** When you need specific node sizes, custom CPU/memory configurations, or specific libraries pre-installed.

### 3. Sizing and Executor Scaling
To optimize Spark job performance, configure these settings in the Spark workspace properties:

| Setting | Purpose | Exam Tip |
|---|---|---|
| **Max Executors** | Upper boundary for executors in a Spark job | Prevents a single job from exhausting your capacity limits |
| **Dynamic Allocation** | Automatically scales executors up/down based on workload | Enabled by default; optimizes compute cost and performance |
| **Driver Size** | Memory/CPU for the Driver node coordinates work | Scale up for driver node OOM (Out Of Memory) errors |
| **Executor Size** | Memory/CPU for task nodes | Scale up to prevent executor-level OOM errors |

---

## 📘 Section 2: Microsoft Fabric Capacity Metrics App

Fabric workloads consume Capacity Units (CUs) allocated to your Fabric Capacity (F-SKUs).

### Interactive vs. Background Operations
The way Fabric measures compute consumption depends on the operation type:

| Operation Type | Examples | CU Consumption Behavior |
|---|---|---|
| **Interactive** | Power BI reports, SQL Queries, Notebook runs | **Short duration spike:** Computed instantly. Smoothed over **10 minutes** to avoid throttling. |
| **Background** | Data Pipelines, Dataflow Gen2 refreshes, Spark Jobs | **Long duration:** Distributed/smoothed over **24 hours** to prevent capacity overload. |

### Throttling & Capacity States
When a capacity exceeds its limit, Fabric implements throttling in stages:
1. **Interactive Delay (Carried forward):** Future interactive requests are slowed down.
2. **Interactive Rejection:** Interactive requests are denied with HTTP 430.
3. **Background Delay/Rejection:** Scheduled runs are delayed or cancelled.

---

## 📘 Section 3: Diagnostic Tools & Log Locations

For the exam, you must know where to find errors:

| Problem | Where to Diagnose | Primary Metric / Log |
|---|---|---|
| **Pipeline Activity Failure** | Pipeline Run History (Monitor view) | Error details JSON, output JSON |
| **Spark Code Error / Run Failure** | Notebook Run -> Spark UI / Logs | Log4j logs, Spark driver logs, executor stdout |
| **Warehouse T-SQL Performance** | SQL Analytics Endpoint DMV | `sys.dm_pdw_exec_requests` |
| **Dataflow Gen2 Failures** | Dataflow Refresh History | Step failure details, Power Query error messages |
| **OneLake Shortcut Failures** | Storage Explorer / Monitoring Hub | Connection state, source permissions |

---

## 📘 Section 4: Optimization Summary Cheat Sheet

```
Is Spark Driver running out of memory (OOM)?
  └── Increase Driver Size in Spark settings.

Are Spark Tasks running out of memory?
  └── Increase Executor Size or decrease executor cores (parallelism).

Do you need sub-second Spark startup time?
  └── Use Starter Pools.

Do you need specific virtual machine sizes or isolated nodes?
  └── Create a Custom Spark Pool.

Is your Fabric Capacity throttling?
  └── Use the Fabric Capacity Metrics App to identify background jobs causing heavy CU consumption, or reschedule background loads across the 24-hour window.
```

---

## 📝 3 DP-700 Practice Questions

### Question 1
You are running a daily Spark notebook execution in Fabric that processes 500 GB of logs. The job occasionally fails with an Out of Memory (OOM) error on the Driver node. What should you configure in the Spark Workspace settings to resolve this?

- A) Enable Auto-compaction
- B) Increase the Executor size
- C) Increase the Driver size
- D) Disable Dynamic Allocation

> **Answer: C** — OOM errors on the Driver node indicate that the driver coordinating the Spark job does not have enough memory to collect and organize partitions. Increasing the Driver size is the direct fix.

---

### Question 2
You trigger a Dataflow Gen2 refresh at 9:00 AM. In the Microsoft Fabric Capacity Metrics app, you notice that this load spikes compute consumption, but no capacity throttling occurs. Why?

- A) Dataflow Gen2 is an interactive operation smoothed over 10 minutes.
- B) Dataflow Gen2 is a background operation smoothed over 24 hours.
- C) Dataflow Gen2 runs on a separate Azure SQL database.
- D) Power Query does not consume Fabric capacity units (CUs).

> **Answer: B** — Scheduled refreshes like Dataflow Gen2 and pipeline runs are classified as **background operations**. Their CU usage is smoothed out over 24 hours to prevent capacity spikes and throttling.

---

### Question 3
Where should a data engineer look to find execution plans, task details, and diagnostic messages for a PySpark notebook that failed?

- A) Monitoring Hub -> View Pipeline logs
- B) Capacity Metrics App
- C) Spark UI / Spark History Server
- D) Fabric Admin Tenant settings

> **Answer: C** — The Spark UI (accessible from the Notebook execution screen or Spark History Server) provides deep diagnostics, execution timelines, memory metrics, and task-level executor logs.

---

## 🔗 Official Microsoft Learn References
- [Spark Workspace Settings in Fabric](https://learn.microsoft.com/en-us/fabric/data-engineering/spark-workspace-settings)
- [Fabric Capacity Metrics App](https://learn.microsoft.com/en-us/fabric/enterprise/monitoring-capacity-metrics-app)
- [Monitoring workloads in Fabric](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/monitoring-overview)
- [DP-700 Study Guide](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/dp-700)
