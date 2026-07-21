# 📚 DP-700 Day 04 Study Guide: Apache Airflow & Pipeline Orchestration in Microsoft Fabric

> **Author:** Sayan Banerjee (Fabric Data Engineer Associate DP-700 Certified)  
> **Topic:** Day 04 / 30 — Apache Airflow Jobs, Workspace Settings, Data Factory Pipelines, Notebook Scheduling & Workflow DAGs  
> **Target Exam:** Microsoft Certified: Fabric Data Engineer Associate (Exam DP-700)

---

## 🎯 1. DP-700 Exam Objectives Covered

This study guide directly maps to **Domain 1: Implement and Manage an Analytics Solution (30–35%)**:
*   **Configure Apache Airflow Workspace Settings:** Enable and configure Apache Airflow environments, requirements (`requirements.txt`), connections, and environment variables at the Fabric workspace level.
*   **Orchestrate Data Processes:** Schedule and trigger Data Factory Pipelines, PySpark Notebooks, Dataflows Gen2, and Airflow DAGs.
*   **Manage Dependencies & Automation:** Implement schedule triggers, storage event triggers, webhooks, and failure notifications.

---

## 🏗️ 2. The 4 Orchestration Engines in Microsoft Fabric

Fabric provides four distinct mechanisms for data transformation and workflow orchestration:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   FABRIC ORCHESTRATION ARCHITECTURE                    │
│                                                                        │
│   ┌────────────────────────┐          ┌────────────────────────────┐   │
│   │ 1. DATA PIPELINES (GUI)│          │ 4. APACHE AIRFLOW (CODE)   │   │
│   │  • Visual drag-and-drop│          │  • Python-based DAGs       │   │
│   │  • Copy Activity       │          │  • Managed Workspace env   │   │
│   │  • Event & Schedules   │          │  • Multi-cloud / Custom    │   │
│   └───────────┬────────────┘          └─────────────┬──────────────┘   │
│               │                                     │                  │
│               └──────────────────┬──────────────────┘                  │
│                                  ▼                                     │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ 2. PYSPARK NOTEBOOKS & 3. DATAFLOWS GEN2                      │   │
│   │ (Execution Engines - CANNOT self-schedule directly!)            │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Tool Comparison Matrix

| Tool | Interface | Primary Purpose | Scheduling Capability |
|---|---|---|---|
| **Data Factory Pipeline** | Visual GUI | High-throughput data copy, pipeline orchestration, activity chaining | Native Schedule, Storage Events, Webhooks |
| **Apache Airflow Job** | Python DAG Code | Code-first complex workflow orchestration, cross-cloud dependencies | Native Airflow Cron Scheduler |
| **PySpark Notebook** | Code (Python/Scala) | Heavy Spark data processing and analytics | **CANNOT self-schedule** (Needs Pipeline or Airflow) |
| **Dataflow Gen2** | Power Query M | Visual low-code data cleansing and transformation | Managed Refresh Schedule |

---

## 🌀 3. Apache Airflow in Microsoft Fabric: Deep Dive

Microsoft Fabric offers **Managed Apache Airflow** as a native workspace item, allowing data engineering teams to write and execute Python-based Directed Acyclic Graphs (DAGs) without managing Kubernetes clusters or infrastructure.

### Airflow Configuration Boundaries (Exam Critical)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      WORKSPACE SETTINGS BOUNDARY                       │
│                                                                        │
│   Workspace Settings ──► Data Engineering ──► Apache Airflow           │
│   ├── Airflow Pool Sizing & Capacity                                   │
│   ├── Custom PyPI Dependencies (requirements.txt)                      │
│   ├── Airflow Connections & Secret Keys                                │
│   └── Environment Variables                                            │
└────────────────────────────────────────────────────────────────────────┘
```

> ⚠️ **Exam Note:** Apache Airflow settings are configured strictly at the **Workspace Settings** level. They are NOT configured at the Tenant Admin level, nor are they individual item properties.

---

## ⚠️ 4. The #1 Scheduling Exam Trap

A frequent distractor pattern on the DP-700 exam concerns **PySpark Notebook scheduling**.

```
❌ WRONG (Exam Distractor):
"Configure a native cron schedule directly inside the Notebook Item Settings."

✅ CORRECT (DP-700 Answer):
"Wrap the PySpark Notebook activity inside a Data Factory Pipeline OR an Apache Airflow DAG."
```

### Key Takeaway for the Exam:
PySpark Notebook items **do not possess native direct scheduling engines**. To automate notebook execution on a recurring schedule or event, you MUST orchestrate the notebook using either a **Data Pipeline** or an **Apache Airflow DAG**.

---

## 🐍 5. Airflow Python DAG Syntax Example

Here is a standard Airflow DAG definition orchestrating data processing in Microsoft Fabric:

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

# Default DAG configuration
default_args = {
    'owner': 'fabric_data_engineer',
    'depends_on_past': False,
    'start_date': datetime(2026, 7, 21),
    'email_on_failure': True,
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

def execute_ingestion_pipeline():
    print("Triggering Data Factory Copy Pipeline...")

def execute_transformation_notebook():
    print("Triggering PySpark Transformation Notebook...")

with DAG(
    'fabric_daily_orchestration_dag',
    default_args=default_args,
    description='Orchestrates Daily Ingestion and PySpark Transformation',
    schedule_interval='0 2 * * *',  # Daily at 2:00 AM UTC
    catchup=False,
) as dag:

    ingest_task = PythonOperator(
        task_id='ingest_raw_sales',
        python_callable=execute_ingestion_pipeline,
    )

    transform_task = PythonOperator(
        task_id='transform_gold_sales',
        python_callable=execute_transformation_notebook,
    )

    # Define DAG execution dependency chain
    ingest_task >> transform_task
```

---

## 📊 6. Pipeline Triggers Comparison

When orchestrating workflows with Data Factory Pipelines, select the appropriate trigger mechanism:

| Trigger Type | How It Works | Primary Use Case |
|---|---|---|
| **Schedule Trigger** | Executes at fixed time intervals (e.g. daily at 2:00 AM) or cron schedules. | Daily/hourly batch ETL jobs. |
| **Storage Event Trigger** | Fires automatically when a file is created or deleted in OneLake / ADLS Gen2. | Real-time file processing as data lands. |
| **Tumbling Window** | Executes periodically over continuous, non-overlapping time windows. | Historical data backfills and stateful processing. |
| **Webhook / REST API** | Invoked externally via HTTP POST requests from Logic Apps or external systems. | Cross-platform event integration. |

---

## ❓ 7. Practice DP-700 Exam Questions (Day 04 Focus)

### Question 1 (Scenario)
**Scenario:** A company is migrating 40 Python-based Apache Airflow DAGs from an AWS MWAA environment into Microsoft Fabric. The data engineering lead needs to configure custom PyPI package dependencies (including `pandas`, `requests`, and `azure-storage-blob`) for the Airflow execution environment.

Where should the Data Engineer configure these Python library dependencies in Microsoft Fabric?

*   A) In Tenant Settings under Admin Portal.
*   B) In Workspace Settings under Data Engineering -> Apache Airflow.
*   C) In the Capacity Metrics App.
*   D) In the PySpark Notebook inline `%pip` cell.

**Correct Answer:** **B**  
**Explanation:** Apache Airflow configurations, including custom `requirements.txt` PyPI dependency management, environment variables, and connections, are managed centrally at the **Workspace Settings** level under Data Engineering -> Apache Airflow. Tenant admin portal (Option A) is too broad, and PySpark inline `%pip` (Option D) applies only to Spark sessions, not Airflow.

---

### Question 2 (Scenario)
**Scenario:** A data analyst writes a PySpark notebook that aggregates daily transactions into a Gold Delta table in a Fabric Lakehouse. The business requires this notebook to execute automatically every day at 3:00 AM IST.

Which action should the Data Engineer take to meet the scheduling requirement?

*   A) Configure a native schedule directly within the PySpark Notebook properties.
*   B) Add a `time.sleep()` loop inside the notebook cell.
*   C) Create a Data Factory Pipeline containing a Notebook Activity pointing to the notebook and add a Schedule Trigger.
*   D) Convert the PySpark notebook into a Dataflows Gen2 item.

**Correct Answer:** **C**  
**Explanation:** PySpark Notebook items in Microsoft Fabric cannot self-schedule directly (Option A is a distractor). To execute a notebook on an automated schedule, it must be wrapped inside a Data Factory Pipeline activity (Option C) or invoked via an Apache Airflow DAG.

---

### Question 3 (Scenario)
**Scenario:** A logistics enterprise requires a data pipeline in Microsoft Fabric to start processing immediately whenever a third-party vendor uploads a new CSV manifest file into an ADLS Gen2 container shortcut in OneLake.

Which pipeline trigger type should be implemented?

*   A) Schedule Trigger
*   B) Storage Event Trigger
*   C) Tumbling Window Trigger
*   D) Manual Trigger

**Correct Answer:** **B**  
**Explanation:** Storage Event Triggers execute pipelines automatically in response to blob/file creation or deletion events in OneLake or ADLS Gen2 containers. Schedule triggers (Option A) execute on time intervals rather than file arrival events.

---

## ✅ Day 04 Revision Checklist

Before proceeding to **Day 05 (Lakehouse Files vs. Managed Delta Tables)**, ensure you can answer:

- [ ] What are the 4 main orchestration mechanisms available in Microsoft Fabric?
- [ ] At what administrative scope are Apache Airflow settings configured in Fabric?
- [ ] Can PySpark Notebook items be scheduled directly without a pipeline or Airflow DAG?
- [ ] What pipeline trigger should be used for instant execution when a new file lands in OneLake?
- [ ] What python object defines tasks and execution order in Apache Airflow (`DAG`)?
