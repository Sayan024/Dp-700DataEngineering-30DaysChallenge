# 📚 DP-700 Day 01 Study Guide: OneLake Architecture & Exam Blueprint

> **Author:** Sayan Banerjee (Fabric Data Engineer Associate DP-700 Certified)  
> **Topic:** Day 01 / 30 — OneLake Architecture, Tenant Topology, Workload Mapping & Exam Domain Breakdown  
> **Target Exam:** Microsoft Certified: Fabric Data Engineer Associate (Exam DP-700)

---

## 🎯 1. Exam DP-700 Blueprint & Skills Measured

The **DP-700: Implementing Data Engineering Solutions Using Microsoft Fabric** exam evaluates your technical competence across three weighted domain areas. 

### 📊 Exam Weightage & Domain Distribution

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Domain 1: Implement & Manage an Analytics Solution      (30–35%)       │
├──────────────────────────────────────────────────────────────────────────┤
│  Domain 2: Ingest & Transform Data                      (30–35%)       │
├──────────────────────────────────────────────────────────────────────────┤
│  Domain 3: Monitor & Optimize an Analytics Solution     (30–35%)       │
└──────────────────────────────────────────────────────────────────────────┘
```

> ⚠️ **Exam Note:** The weight distribution is evenly split across all three domains. You cannot pass the exam by mastering data transformation alone; security, workspace settings, git integration, deployment pipelines, and query optimization carry equal weight.

---

### 🔍 Objective Domain Summary

#### Domain 1: Implement and Manage an Analytics Solution (30–35%)
*   **Configure Fabric Workspace Settings:** Capacity allocation, Spark custom pools, default runtimes, domain mapping, Airflow environments.
*   **Implement Lifecycle Management:** Git integration (version control for items), Database Projects (SQL schema management), Deployment Pipelines (Dev → Test → Prod).
*   **Implement Security & Governance:** Item-level permissions, OneLake data access roles, Row-Level Security (RLS), Column-Level Security (CLS), Dynamic Data Masking (DDM), sensitivity labels.
*   **Orchestrate Data Flows:** Pipeline scheduling, event triggers, failure notifications, parameters, and expressions.

#### Domain 2: Ingest and Transform Data (30–35%)
*   **Design & Implement Batch Ingestion:** Dataflows Gen2, Data Factory Pipelines (Copy activity), PySpark Notebooks, OneLake Shortcuts, Mirrored Databases.
*   **Design & Implement Batch Transformation:** PySpark DataFrames/Delta Lake API, SQL Analytics Endpoint, Data Warehouse T-SQL (`COPY INTO`, `CTAS`), Star Schema design.
*   **Design & Implement Real-Time Ingestion/Transformation:** Eventstreams, Eventhouse / KQL Databases, Spark Structured Streaming, windowing functions, time-series transformations.

#### Domain 3: Monitor and Optimize an Analytics Solution (30–35%)
*   **Monitor Analytics Processes:** Pipeline run history, Dataflow refresh logs, Spark application UI, Capacity Metrics App, Eventstream logs.
*   **Optimize Performance:** Spark tuning (V-Order, Z-Ordering, partitioning, executor allocation), SQL Warehouse tuning (DMVs, statistics, cross-database query patterns), indexing strategies in KQL.

---

### ❌ Exam Scope Clarification: What is OUT OF SCOPE?

| Topic | Status | Note |
|---|---|---|
| Data Engineering (Pipelines, Spark, T-SQL, KQL) | ✅ **IN SCOPE** | Core focus of DP-700 |
| OneLake & Governance (Shortcuts, Security, Git, CI/CD) | ✅ **IN SCOPE** | Core focus of DP-700 |
| Real-Time Streaming (Eventstream, KQL DB, Reflex) | ✅ **IN SCOPE** | Core focus of DP-700 |
| Data Science (ML Model Training, MLflow, Data Wrangler) | ❌ **OUT OF SCOPE** | Part of DP-600 / AI certifications |
| Deep Power BI DAX Modeling & Complex Visual Layouts | ❌ **OUT OF SCOPE** | Part of PL-300 / DP-600 |

---

## 🏗️ 2. OneLake Architecture: Deep Dive

### What is OneLake?
**OneLake** is the single, unified, logical data lake for your entire organization in Microsoft Fabric. Analagous to how **OneDrive** unifies all Office documents, OneLake unifies all enterprise data files across tenants, workspaces, and compute engines.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              TENANT                                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                          ONELAKE                                 │  │
│  │  ┌────────────────────────┐    ┌──────────────────────────────┐  │  │
│  │  │   Workspace A (Sales)  │    │   Workspace B (Finance)      │  │  │
│  │  │  ┌──────────────────┐  │    │  ┌────────────────────────┐  │  │  │
│  │  │  │    Lakehouse     │  │    │  │     Data Warehouse     │  │  │  │
│  │  │  │ ┌──────────────┐ │  │    │  │ ┌────────────────────┐ │  │  │  │
│  │  │  │ │ Delta Tables │ │  │    │  │ │    Delta Tables    │ │  │  │  │
│  │  │  │ └──────────────┘ │  │    │  │ └────────────────────┘ │  │  │  │
│  │  │  └──────────────────┘  │    │  └────────────────────────┘  │  │  │
│  │  └────────────────────────┘    └──────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Key OneLake Architectural Principles

1. **One Tenant = One Lake:** There is exactly **one** OneLake per Microsoft Entra ID (Azure AD) tenant. You do not provision multiple OneLakes; workspace provisioning automatically organizes data within the single tenant lake.
2. **Open Data Format Standard (Delta Parquet):** All tabular data in Fabric Lakehouses and Data Warehouses is stored in open-source **Delta Lake format** (`.parquet` files with `_delta_log` transaction logs).
3. **Compute and Storage Decoupling:** Storage is unified in OneLake, while multiple compute engines (Spark, SQL, KQL, Power BI Direct Lake) operate on top of the exact same physical storage without data duplication.
4. **V-Order Optimization:** Fabric automatically applies **V-Order** write-time optimization to Delta Parquet files. V-Order arranges dictionary encoding and sorting to maximize in-memory read efficiency for Power BI Direct Lake queries.

---

### OneLake Hierarchy & Structure

```
Tenant
  └── Capacity (F SKUs or Trial)
       └── Domains (Sales, Marketing, HR)
            └── Workspaces
                 ├── Lakehouse (Files & Tables)
                 ├── Data Warehouse (Tables)
                 └── KQL Database / Eventhouse
```

*   **Tenant:** The top-level administrative boundary linked to your Microsoft Entra ID organization.
*   **Capacities:** Billing and compute units (e.g., F2, F64, F512) that power Fabric workloads.
*   **Domains:** Organizational boundaries used to group related workspaces (e.g., Finance Domain) supporting Data Mesh architecture.
*   **Workspaces:** Collaborative containers where items (Lakehouses, Warehouses, Pipelines, Notebooks) are created.

---

### OneLake Shortcuts

Shortcuts are **virtual objects** in OneLake that point to internal or external storage locations without copying physical data.

```
┌─────────────────────────────────────────────────────────────┐
│                    Lakehouse / Files Folder                 │
│                                                             │
│   ├── Sales_Data_2026/  (Native Delta Table)                │
│   └── S3_Raw_Logs/  ─────────► [Virtual Link / Shortcut]   │
│                                        │                    │
└────────────────────────────────────────┼────────────────────┘
                                         ▼
                              AWS S3 Bucket (External)
```

#### Supported Shortcut Targets:
1. **Internal Shortcuts:** Point to another OneLake location (across Lakehouses or Workspaces).
2. **External ADLS Gen2 Shortcuts:** Point to Azure Data Lake Storage Gen2.
3. **External Amazon S3 Shortcuts:** Point to AWS S3 buckets (supports AWS IAM role credentials).
4. **External Google Cloud Storage Shortcuts:** Point to Google Cloud Storage buckets.

#### Benefits of Shortcuts:
*   Eliminates Data Copying (Zero ETL / Zero Latency).
*   Enables Cross-Cloud Analytics without egress cost spikes.
*   Enables **Data Mesh** implementation by sharing data across domain workspaces without duplicating datasets.

---

## 🛠️ 3. Microsoft Fabric Core Workloads & Compute Engines

Fabric consolidates 7 distinct analytics workloads into a single SaaS interface:

| Workload | Compute Engine | Primary Use Case | Storage Format |
|---|---|---|---|
| **Lakehouse** | Apache Spark 3.5 + SQL Analytics Endpoint | Big data processing, PySpark ETL, unstructured + structured data processing | Delta Parquet & Raw Files |
| **Data Warehouse** | Distributed T-SQL (Serverless DW Engine) | Enterprise data warehousing, ACID T-SQL transactions, cross-database JOINs | Delta Parquet (V-Order optimized) |
| **Real-Time Intelligence** | Eventhouse / Kusto Engine | High-throughput streaming ingestion, log analytics, real-time dashboards | KQL Native / Delta Tables |
| **Data Factory** | Dataflows Gen2 (Mashup) & Pipelines | Low-code ETL, data orchestration, job scheduling, cloud data copying | Connects to 150+ sources |
| **Data Activator** | Reflex Engine | Real-time monitoring, event detection, automated alerts (Teams/Email/Webhooks) | Event triggers |
| **Power BI** | Analysis Services (Direct Lake) | Business Intelligence, interactive dashboards reading directly from OneLake | Direct Lake on Delta Parquet |

---

## 💡 4. Ingestion Selection Framework (Exam Critical)

A frequent pattern in DP-700 exam scenarios is selecting the correct ingestion tool for a specific enterprise requirement.

```
                         What is your data requirement?
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
     No data movement?                                    Data movement needed?
            │                                                     │
            ▼                                        ┌────────────┴────────────┐
  Use OneLake Shortcuts                              ▼                         ▼
  (ADLS, S3, GCS, OneLake)                     Low-Code / Visual?         Code-First / Heavy ETL?
                                                     │                         │
                                                     ▼                         ▼
                                             Dataflows Gen2           Notebooks (PySpark)
                                           or Copy Pipelines          or T-SQL COPY INTO
```

### Quick Decision Matrix

| Scenario Requirement | Recommended Tool | Rationale |
|---|---|---|
| Query AWS S3 buckets without copying data | **OneLake Shortcut** | Virtual link; zero data duplication. |
| Ingest 100+ CSV files into Lakehouse on a schedule | **Data Factory Pipeline** | Optimized for bulk copy activity and scheduling. |
| Clean & transform data using Power Query UI (Low-Code) | **Dataflows Gen2** | Visual data transformation for business users. |
| Perform complex data cleansing using Python/DataFrames | **PySpark Notebook** | Full Spark compute runtime with Delta Lake support. |
| High-performance bulk load into Data Warehouse | **T-SQL `COPY INTO`** | Native, parallelized T-SQL bulk ingestion statement. |
| Real-time streaming logs from IoT devices | **Fabric Eventstreams** | High-frequency streaming route to KQL Database. |
| Real-time database replication from SQL Server / Cosmos | **Mirrored Databases** | Change Data Capture (CDC) replication into OneLake. |

---

## ❓ 5. Practice DP-700 Exam Questions (Day 01 Focus)

### Question 1 (Scenario)
**Scenario:** An enterprise data engineering team needs to analyze 5 TB of web telemetry logs stored in an Amazon S3 bucket. The analytical queries will be executed using PySpark in a Microsoft Fabric Lakehouse. The team has strict requirements to avoid data duplication and minimize egress bandwidth costs.

Which approach should the Data Engineer implement?

*   A) Use Dataflows Gen2 to copy data from Amazon S3 into the Lakehouse Files section.
*   B) Create an Amazon S3 Shortcut in the Lakehouse Files section pointing to the S3 bucket URI.
*   C) Use a Data Factory Pipeline with a Copy Activity to transfer data from S3 to OneLake.
*   D) Configure Mirrored Databases for Amazon S3 in the Fabric workspace.

**Correct Answer:** **B**  
**Explanation:** OneLake Shortcuts allow you to create virtual links to external data stores (such as AWS S3, ADLS Gen2, and GCS) without physically copying data into OneLake. Options A and C involve copying data, violating the zero-duplication requirement. Option D is incorrect because Mirroring is designed for databases (like Azure SQL, Cosmos DB, Snowflake), not object storage buckets.

---

### Question 2 (Scenario)
**Scenario:** A company is migrating its data warehouse to Microsoft Fabric. The BI team requires sub-second query performance on Power BI dashboards connected to a 10 TB Lakehouse dataset. They want to avoid importing data into a Power BI Semantic Model (Import Mode) and avoid the query translation latency of DirectQuery.

Which storage mode should be utilized for the semantic model?

*   A) Import Mode
*   B) DirectQuery Mode
*   C) Dual Mode
*   D) Direct Lake Mode

**Correct Answer:** **D**  
**Explanation:** Direct Lake mode is a ground-breaking capability of Power BI on Microsoft Fabric that reads Delta Parquet files directly from OneLake without loading data into memory (Import) or translating DAX to SQL (DirectQuery). V-Order optimization ensures sub-second performance directly from storage.

---

### Question 3 (Multiple Choice)
**Which two statement(s) accurately describe OneLake architecture within an enterprise tenant? (Select TWO)**

*   A) An organization can provision up to 5 OneLakes per Azure region.
*   B) There is exactly one OneLake per Microsoft Entra ID tenant.
*   C) Each Fabric Workspace automatically creates a standalone, isolated storage account.
*   D) Tabular data in Lakehouses and Data Warehouses is stored in open-source Delta Parquet format.
*   E) OneLake requires all data to be converted into proprietary Microsoft `.pbix` format.

**Correct Answer:** **B and D**  
**Explanation:** There is exactly one OneLake per Microsoft Entra ID tenant (Option B). All tabular data across Fabric Lakehouses and Warehouses is stored in Delta Lake format (`.parquet` with Delta transaction logs) (Option D).

---

## 📝 6. Key Terminology Glossary

*   **OneLake:** The single, unified SaaS data lake for an entire Microsoft Entra ID tenant.
*   **Delta Parquet:** An open-source storage layer that brings ACID transactions to Apache Spark and big data workloads.
*   **V-Order:** A write-time optimization applied to Parquet files in Fabric that sorts and compresses dictionary encoding for fast Direct Lake querying.
*   **Direct Lake:** A Power BI semantic model mode that reads Delta Parquet files directly from OneLake without caching or query translation.
*   **OneLake Shortcut:** A symbolic link pointing to external storage (S3, ADLS, GCS) or internal OneLake locations.
*   **Domain:** An administrative grouping of Fabric workspaces used to implement Data Mesh governance.
*   **Capacity:** The dedicated pool of compute resources (measured in Capacity Units / CUs) allocated to a Fabric tenant or workspace.

---

## ✅ Day 01 Revision Checklist

Before moving to **Day 02 (Spark Workspace Settings & Custom Pools)**, make sure you can answer:

- [ ] What is the single top-level storage boundary in Microsoft Fabric?
- [ ] What storage format do Fabric Lakehouses and Warehouses use?
- [ ] What is the difference between Import Mode, DirectQuery, and Direct Lake in Power BI?
- [ ] What are the 4 supported targets for OneLake Shortcuts?
- [ ] What are the 3 major domains tested in the DP-700 exam, and what are their weightages?
