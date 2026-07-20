# Day 04 Study Guide — Apache Airflow & Pipeline Orchestration in Microsoft Fabric

> **DP-700 Domain:** Implement and manage an analytics solution (30–35%)
> **Skill:** Configure Microsoft Fabric workspace settings → Configure Apache Airflow workspace settings
> **Also covers:** Orchestrate processes → Choose between Dataflow Gen2, pipeline, and notebook; Design triggers; Implement orchestration patterns

---

## 🎯 What You Must Know for DP-700

The July 21, 2026 update of the DP-700 exam **explicitly lists Apache Airflow** as a testable skill. The exam tests:
1. **Configure Apache Airflow workspace settings** in Fabric
2. **Choose between Dataflow Gen2, a Pipeline, and a Notebook** for orchestration
3. **Design and implement schedules and event-based triggers**
4. **Implement orchestration patterns** with notebooks and pipelines, including parameters and dynamic expressions

---

## 📘 Section 1: What Is Pipeline Orchestration?

Orchestration in Microsoft Fabric means **coordinating the sequence, dependencies, retry logic, and triggers** of data engineering tasks across notebooks, pipelines, Dataflows Gen2, and Apache Airflow DAGs.

### Fabric Orchestration Landscape

| Tool | Best For | Trigger Support | Code / No-Code |
|---|---|---|---|
| **Data Pipeline** | Copy, batch ELT, multi-step control flow | Schedule, Event | Low-code (GUI) |
| **Notebook** | PySpark transformation, ad-hoc compute | Manual, Pipeline call | Code |
| **Dataflow Gen2** | Power Query M transforms, Power BI refresh | Schedule | No-code |
| **Apache Airflow (Managed)** | Complex DAG-based orchestration, multi-system | CRON, Event, Sensor | Code (Python) |

---

## 📘 Section 2: Apache Airflow in Microsoft Fabric (Managed Airflow)

### What It Is
Microsoft Fabric offers **Managed Apache Airflow** — a fully managed, serverless Airflow environment inside your Fabric workspace. You don't manage the Airflow cluster; Fabric handles infra.

### Key Workspace Settings to Configure
| Setting | What It Does |
|---|---|
| **Airflow enabled** | Toggle to activate Managed Airflow in the workspace |
| **Environment size** | Small / Medium / Large (maps to compute allocated) |
| **DAG folder (OneLake path)** | Where your Python DAG `.py` files are stored |
| **Plugin folder** | Custom Airflow plugins/operators |
| **Requirements.txt** | Extra Python packages for your DAGs |
| **Airflow Configuration Overrides** | Custom `airflow.cfg` key-value overrides |

### Exam Tip ⚠️
> **You configure Airflow at the workspace level**, NOT at the item level. The DAG files themselves live in a OneLake-mounted folder, giving them native Fabric storage integration.

---

## 📘 Section 3: Directed Acyclic Graphs (DAGs)

A **DAG** is the core unit in Airflow. It's a Python script that defines:
- **Tasks**: Units of work (e.g., run a Fabric notebook, copy data, call REST API)
- **Dependencies**: Which tasks run after which (no cycles allowed — hence "Acyclic")
- **Schedule**: When the DAG runs (`schedule_interval`)

### Fabric-Native Airflow Operators
The Fabric Managed Airflow comes with **built-in Fabric operators**:

| Operator | What It Triggers |
|---|---|
| `FabricRunNotebookOperator` | Runs a Fabric Notebook |
| `FabricRunPipelineOperator` | Triggers a Data Factory Pipeline in Fabric |
| `FabricRunDataflowOperator` | Triggers a Dataflow Gen2 refresh |

```python
from airflow import DAG
from airflow.providers.microsoft.fabric.operators.notebook import FabricRunNotebookOperator
from datetime import datetime

with DAG(
    dag_id='dp700_bronze_to_silver',
    schedule_interval='0 6 * * *',   # Daily at 06:00
    start_date=datetime(2026, 1, 1),
    catchup=False
) as dag:

    ingest = FabricRunNotebookOperator(
        task_id='ingest_raw_data',
        workspace_id='<workspace-id>',
        notebook_id='<notebook-id>'
    )

    transform = FabricRunNotebookOperator(
        task_id='transform_bronze_to_silver',
        workspace_id='<workspace-id>',
        notebook_id='<transform-notebook-id>'
    )

    ingest >> transform   # ingest runs first, then transform
```

---

## 📘 Section 4: Triggers & Schedules

### Schedule-Based Triggers (Time-Driven)

| Tool | How |
|---|---|
| **Pipeline** | Built-in schedule trigger (UI) — Date/Time or Recurrence |
| **Notebook** | Cannot schedule directly — must be called from a Pipeline |
| **Dataflow Gen2** | Built-in schedule in Power BI/Fabric UI |
| **Apache Airflow** | `schedule_interval` in DAG definition (CRON or preset) |

### Event-Based Triggers (Data-Driven)

| Trigger Type | Tool | Example |
|---|---|---|
| **Storage Event** | Pipeline | New file lands in ADLS/OneLake → trigger pipeline |
| **Reflex Alert** | Fabric Activator | Metric threshold breach → trigger notebook |
| **Airflow Sensor** | Airflow DAG | `ExternalTaskSensor`, `FileSensor` |

### Exam Trap ⚠️
> **Notebooks CANNOT be scheduled directly.** You must wrap them in a **Data Pipeline** or a **Fabric Airflow DAG** to schedule them. This is a classic DP-700 trick question.

---

## 📘 Section 5: Orchestration Patterns

### 1. Parameters & Dynamic Expressions

In Fabric Pipelines, you can pass **parameters** to notebooks and other activities:

```json
// Pipeline parameter definition
{
  "load_date": "@formatDateTime(utcNow(), 'yyyy-MM-dd')",
  "env": "production"
}
```

Notebooks receive parameters via `mssparkutils.notebook.run()` with `arguments`:
```python
mssparkutils.notebook.run("Silver_Transform", 600, {"load_date": "2026-07-20"})
```

### 2. Sequential Pattern
Tasks run one after another. Default pipeline activity chain.

### 3. Parallel Pattern
Multiple activities run simultaneously (`Switch`, `ForEach` with `isSequential: false`).

### 4. Conditional Pattern
`If Condition` activity branches based on pipeline expression evaluation.

### 5. Retry & Error Handling
Each pipeline activity has:
- **Retry count**: How many times to retry on failure
- **Retry interval**: Seconds between retries
- **On Failure / On Skip / On Success** paths for error routing

---

## 📘 Section 6: Choose the Right Tool (Exam Decision Logic)

```
Need to orchestrate multiple Fabric items with dependencies?
  ├── Simple chain of 2-5 activities → Data Pipeline
  ├── Complex multi-system, cross-platform DAG → Apache Airflow (Managed)
  └── Just a single transformation → Notebook (called from Pipeline)

Need to trigger on new data arrival?
  ├── File arrives in OneLake/ADLS → Pipeline Storage Event Trigger
  ├── Metric threshold breached → Fabric Activator (Reflex)
  └── External system event → Airflow Sensor or custom Logic App

Need to transform data without code?
  └── Dataflow Gen2 (Power Query M)

Need to run PySpark at scale?
  └── Notebook (called via Pipeline or Airflow)
```

---

## 📘 Section 7: DP-700 Exam Traps

### Trap 1: "Which tool can you schedule directly?"
**Answer:** Pipelines and Dataflow Gen2 — NOT notebooks in isolation.

### Trap 2: "Where is Airflow configured in Fabric?"
**Answer:** At the **workspace level** → Workspace Settings → Apache Airflow. Not at the item level, not at tenant level.

### Trap 3: "What's the difference between a Pipeline and Airflow for orchestration?"
| | Pipeline | Airflow |
|---|---|---|
| Code-free GUI | ✅ Yes | ❌ No (Python DAGs) |
| Multi-system | Limited | Full (any REST, Operator) |
| DAG-style deps | No | ✅ Yes |
| Best for | Fabric-native ELT | Complex enterprise orchestration |

### Trap 4: "Can Airflow DAGs use dynamic parameters?"
**Answer:** Yes — Airflow supports `Jinja templating` in task parameters (e.g., `{{ ds }}` for execution date), which is similar to Fabric Pipeline's `@utcNow()` dynamic expressions.

---

## 📝 3 DP-700 Practice Questions

### Question 1
You need to run a series of PySpark notebooks in sequence every day at 6 AM IST, with each notebook receiving the execution date as a parameter. The workflow has 5 notebooks with linear dependencies. Which orchestration approach is MOST appropriate?

- A) Schedule each notebook independently
- B) Create a Data Pipeline with five Notebook activities chained sequentially, use a schedule trigger with the date as a pipeline parameter
- C) Use Apache Airflow DAG with FabricRunNotebookOperator and schedule_interval='0 0:30 * * *'
- D) Use Dataflow Gen2 with a scheduled refresh

> **Answer: B** — Pipelines natively chain notebook activities, pass parameters, and support schedule triggers. Answer C is also technically valid but more complex than necessary for a simple linear 5-step flow. A is wrong (notebooks can't self-schedule). D is wrong (Dataflow Gen2 is for M transformations, not notebook orchestration).

---

### Question 2
A data engineer wants to configure Apache Airflow in their Fabric workspace. Where do they go in the Fabric portal?

- A) Admin Portal → Tenant Settings → Apache Airflow
- B) Workspace Settings → Apache Airflow
- C) Data Engineering item → New → Managed Airflow
- D) OneLake Explorer → Airflow Configuration

> **Answer: B** — Apache Airflow is configured at the **Workspace Settings** level. This is explicitly tested in the DP-700 "Configure Microsoft Fabric workspace settings" objective.

---

### Question 3
You have a Fabric Data Pipeline that triggers a notebook when a new CSV file arrives in a OneLake folder. Which trigger type are you using?

- A) Schedule trigger
- B) Tumbling window trigger
- C) Storage event trigger
- D) Manual trigger

> **Answer: C** — Storage event triggers fire when files arrive, are modified, or are deleted in connected storage (OneLake, ADLS Gen2). Schedule triggers are time-based. Tumbling window is for time-sliced micro-batches.

---

## 🔗 Official Microsoft Learn References

- [Configure Apache Airflow in Fabric](https://learn.microsoft.com/en-us/fabric/data-engineering/apache-airflow-jobs-overview)
- [Data Factory Pipeline overview](https://learn.microsoft.com/en-us/fabric/data-factory/data-factory-overview)
- [Orchestrate Fabric with Pipelines](https://learn.microsoft.com/en-us/fabric/data-factory/pipeline-runs)
- [DP-700 Study Guide (July 21, 2026)](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/dp-700)
