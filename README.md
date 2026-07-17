# 🔷 30 Days of Microsoft Fabric DP-700

<div align="center">

### By [Sayan Banerjee](https://www.linkedin.com/in/sayanbanerjee24) &bull; Fabric Data Engineer &bull; Embee Software

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sayan%20Banerjee-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sayanbanerjee24)
[![Microsoft Fabric](https://img.shields.io/badge/Microsoft-Fabric-0078d4?style=for-the-badge&logo=microsoft&logoColor=white)](https://learn.microsoft.com/en-us/fabric/)
[![DP-700](https://img.shields.io/badge/Exam-DP--700%20Certified-00b4d8?style=for-the-badge)](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/dp-700)
[![Databricks](https://img.shields.io/badge/Databricks-Certified-FF3621?style=for-the-badge&logo=databricks&logoColor=white)](https://databricks.com)

</div>

---

<div align="center">

**A 30-day public learning challenge** — every day, one new topic from the  
**DP-700: Implementing Data Engineering Solutions Using Microsoft Fabric** exam syllabus.

*Carousel slides + LinkedIn post copy + study notes, all free and open source.*

</div>

---

## 👋 About Me

I'm **Sayan Banerjee** — Databricks Certified Data Engineer, Microsoft Fabric Data Engineer (DP-700), and Power BI Analyst (PL-300). I work as an AI, BI & Analytics Consultant at **Embee Software Pvt. Ltd.**, Kolkata.

🔗 **Follow this journey on LinkedIn**: [linkedin.com/in/sayanbanerjee24](https://www.linkedin.com/in/sayanbanerjee24)
📧 **Email**: work.sayanbanerjee@gmail.com

---

## 🗺️ The 30-Day Roadmap

```
Week 1 (Days  1– 6) ─── Architecture & Workspaces
Week 2 (Days  7–13) ─── Batch Ingestion & Transformation
Week 3 (Days 14–19) ─── Data Warehousing & T-SQL
Week 4 (Days 20–25) ─── Real-Time Intelligence & KQL
Week 5 (Days 26–30) ─── Monitor, Optimize & CI/CD
```

---

## 📅 Content Index

### ✅ Week 1 — Architecture & Workspaces

| Day | Status | Topic | Slides (PNG) | Post Copy |
|-----|--------|-------|-------------|-----------|
| **01** | ✅ Live | OneLake Architecture & Exam Blueprint | [View Slides](30-Day-Content/Day-01/slides/) | [Read Post](30-Day-Content/Day-01/post-copy.md) |
| **02** | ⏳ Coming | Spark Workspace Settings & Custom Pools | — | — |
| **03** | ⏳ Coming | OneLake Workspace Settings & Access Control | — | — |
| **04** | ⏳ Coming | Apache Airflow Workflow Orchestration in Fabric | — | — |
| **05** | ⏳ Coming | Lakehouse: Files vs. Managed Delta Tables | — | — |
| **06** | ⏳ Coming | Delta Lake Deep Dive: V-Order, Time Travel, Schema Evolution | — | — |

### ⏳ Week 2 — Batch Ingestion & Transformation

| Day | Topic |
|-----|-------|
| 07 | Dataflows Gen2 vs Pipelines vs Notebooks — When to use what? |
| 08 | OneLake Shortcuts: Cross-workspace and Multi-cloud Links |
| 09 | Mirrored Databases: Real-time Replication from External DBs |
| 10 | Full vs Incremental Load Patterns |
| 11 | PySpark Batch Transformation Techniques |
| 12 | Denormalization & Star Schema Preparation in Fabric |
| 13 | Handling Duplicate, Missing & Late-Arriving Data |

### ⏳ Week 3 — Data Warehousing & T-SQL

| Day | Topic |
|-----|-------|
| 14 | Data Warehouse vs Lakehouse SQL Analytics Endpoint |
| 15 | Ingestion Patterns: COPY INTO & CTAS in Fabric DW |
| 16 | Cross-Database Querying with T-SQL in Fabric |
| 17 | Row-Level, Column-Level & Object-Level Security |
| 18 | Dynamic Data Masking (DDM) for Sensitive Data |
| 19 | Monitoring DW Queries with DMVs |

### ⏳ Week 4 — Real-Time Intelligence & KQL

| Day | Topic |
|-----|-------|
| 20 | Real-Time Hub & Eventstream Architecture |
| 21 | Stream Transformation with Fabric Eventstreams |
| 22 | KQL Databases & Kusto Query Language Fundamentals |
| 23 | Native Tables vs OneLake Shortcuts in RTI |
| 24 | Spark Structured Streaming in Fabric |
| 25 | Real-Time Dashboards & Data Activator Reflexes |

### ⏳ Week 5 — Monitor, Optimize & CI/CD

| Day | Topic |
|-----|-------|
| 26 | Git Integration & Workspace Version Control |
| 27 | Database Projects for Local Schema Management |
| 28 | Deployment Pipelines: Dev → Test → Production |
| 29 | Monitoring & Resolving Ingestion/Transformation Errors |
| 30 | Fabric Performance Optimization: Spark, V-Order & DW |

---

## 📁 Repository Structure

```
📦 30-Day-Content/
├── 📁 Day-01/
│   ├── 🌐 carousel.html          ← Source HTML (editable, 10 slides)
│   ├── 📝 post-copy.md           ← LinkedIn + Twitter post text
│   ├── 🟢 export-slides.js       ← Playwright PNG export script
│   └── 📁 slides/
│       ├── 🖼️ slide-01.png       ← Cover slide
│       ├── 🖼️ slide-02.png       ← What is DP-700?
│       ├── 🖼️ slide-03.png       ← Why Microsoft Fabric?
│       ├── 🖼️ slide-04.png       ← 3 Exam Domains
│       ├── 🖼️ slide-05.png       ← OneLake Architecture
│       ├── 🖼️ slide-06.png       ← 9 Key Tools
│       ├── 🖼️ slide-07.png       ← 3 Languages
│       ├── 🖼️ slide-08.png       ← 30-Day Roadmap
│       ├── 🖼️ slide-09.png       ← Pro Tip
│       └── 🖼️ slide-10.png       ← CTA / Follow for Day 2
├── 📁 Day-02/                    ← Coming tomorrow
└── ...
```

---

## 🎯 DP-700 Exam Quick Reference

> Last updated against the official study guide: **July 21, 2026**

### Skills at a Glance

| Domain | Weight | What's Covered |
|--------|--------|----------------|
| **Implement & Manage Analytics** | 30–35% | Workspace settings (Spark, OneLake, Airflow, domain), lifecycle management (Git, DB Projects, Deployment Pipelines), security & governance (RLS, OLS, DDM, sensitivity labels, OneLake security), orchestration |
| **Ingest & Transform Data** | 30–35% | Loading patterns (full/incremental/streaming), batch ingestion (Dataflows Gen2, Notebooks, Pipelines, Shortcuts, Mirroring), streaming (Eventstreams, Spark Structured Streaming, KQL, windowing) |
| **Monitor & Optimize** | 30–35% | Monitor fabric items (ingestion, transformation, semantic model, alerts), identify & resolve errors (pipeline, Dataflow, notebook, Eventhouse, Eventstream, T-SQL, Shortcut), optimize performance (Lakehouse, pipelines, DW, Eventstreams, Spark, queries) |

### Core Languages

| Language | Used In | Key Skills |
|----------|---------|------------|
| **SQL / T-SQL** | Data Warehouse | COPY INTO, CTAS, cross-DB queries, RLS, DDM |
| **PySpark / Python** | Notebooks | ETL transformations, Delta operations, structured streaming, optimization |
| **KQL** | Eventhouse | Real-time queries, time-series, windowing functions |

---

## 🚀 How to Use These Resources

### Export Slides as PNG (automated)

```bash
# From any Day-XX folder:
npm install playwright
npx playwright install chromium
node export-slides.js
# → slides/slide-01.png through slide-10.png
```

### Post to LinkedIn as Carousel

1. Combine all PNGs into a single **PDF** (use any PDF tool)
2. On LinkedIn: **Start a post → Add document** → upload the PDF
3. LinkedIn renders it as a swipeable carousel automatically
4. Paste the post copy from `post-copy.md`
5. Add your own commentary and engage with comments!

---

## 📚 Official Resources

| Resource | Link |
|----------|------|
| DP-700 Certification Page | [learn.microsoft.com/credentials/certifications/exams/dp-700](https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-700) |
| Official Study Guide (July 2026) | [DP-700 Study Guide](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/dp-700) |
| Microsoft Fabric Docs | [learn.microsoft.com/fabric](https://learn.microsoft.com/en-us/fabric/) |
| Skills Resources by Andy Cutler | [serverlesssql.com](https://www.serverlesssql.com/dp-700-microsoft-fabric-data-engineering-associate-skills-measured-resources/) |
| Microsoft Learn Labs (Official Repo) | [MicrosoftLearning/DP-700](https://github.com/MicrosoftLearning/DP-700-Microsoft-Fabric-Data-Engineer) |
| Reddit Community | [r/MicrosoftFabric](https://www.reddit.com/r/MicrosoftFabric/) |

---

## ⭐ If this helps you, please star the repo!

Every star motivates me to keep publishing daily. Follow me on [LinkedIn](https://www.linkedin.com/in/sayanbanerjee24) to get notified when new days drop!

---

<div align="center">

Made with 🔷 by **Sayan Banerjee** &bull; Kolkata, India &bull; 2026

*All content aligned with the official DP-700 Skills Measured document (July 2026)*

</div>
