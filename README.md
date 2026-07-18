# 🔷 30 Days of Microsoft Fabric — DP-700 Certification Challenge

<div align="center">

### Designed and Authored by [Sayan Banerjee](https://www.linkedin.com/in/sayanbanerjee24)
**AI, BI & Analytics Consultant &bull; Embee Software Pvt. Ltd., Kolkata**  
*Fabric Data Engineer (DP-700) &bull; Databricks Certified &bull; Power BI Analyst (PL-300)*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sayan%20Banerjee-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sayanbanerjee24)
[![Microsoft Fabric](https://img.shields.io/badge/Microsoft-Fabric-0078d4?style=for-the-badge&logo=microsoft&logoColor=white)](https://learn.microsoft.com/en-us/fabric/)
[![DP-700](https://img.shields.io/badge/Exam-DP--700-00a2a2?style=for-the-badge)](https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/dp-700)
[![License](https://img.shields.io/badge/Content-©%20Sayan%20Banerjee-red?style=for-the-badge)](./LICENSE)

<br/>

<a href="https://learn.microsoft.com/api/credentials/share/en-in/SayanBanerjee-3854/2BD18E16EC520850?sharingId=4A16B92B473CC26C" target="_blank">
  <img src="https://learn.microsoft.com/media/learn/certification/badges/microsoft-certified-associate-badge.svg?branch=main" width="130" alt="Microsoft Certified: Fabric Data Engineer Associate Badge" />
</a>

#### [🏆 Verified Microsoft Credential Profile](https://learn.microsoft.com/api/credentials/share/en-in/SayanBanerjee-3854/2BD18E16EC520850?sharingId=4A16B92B473CC26C)
**Credential ID:** `2BD18E16EC520850` | **Certification Number:** `0FI4FA-79E7AC`  
*Earned on February 19, 2026 &bull; Validated via Microsoft Learn*

</div>

---

## 📖 Project Overview

This repository hosts the official resources, slide deck source files, and detailed technical documentation for the **30-Day Microsoft Fabric DP-700 Challenge**. 

Every day, a new core topic from the official **Microsoft Certified: Fabric Data Engineer Associate (DP-700)** curriculum is researched, structured, and published. The slides are modeled after the visual design language of the official **Microsoft Fabric Community** platform to maintain a clean, professional, and easily recognizable look.

---

## 🗺️ 30-Day Syllabus Roadmap

The curriculum is structured across 5 distinct blocks, fully covering all exam areas:

```
├── Week 1 (Days 01-06): Core Architecture & Workspace Administration
├── Week 2 (Days 07-13): Batch Data Ingestion & Transformation Design
├── Week 3 (Days 14-19): Data Warehousing Implementation & T-SQL Optimization
├── Week 4 (Days 20-25): Real-Time Intelligence & Streaming Pipelines
└── Week 5 (Days 26-30): Production Monitoring, Performance Tuning & CI/CD
```

### Content Directory Index

| Day | Status | Target Topic |
| :---: | :---: | :--- |
| **[Day 01](Day-01/)** | ✅ Live | [OneLake Architecture & Exam Blueprint](Day-01/) |
| **[Day 02](Day-02/)** | ✅ Live | [Spark Workspace Settings & Custom Pools](Day-02/) |
| **Day 03** | ⏳ Pending | OneLake Settings & Access Control |
| **Day 04** | ⏳ Pending | Apache Airflow in Microsoft Fabric |
| **Day 05** | ⏳ Pending | Lakehouse — Files vs. Managed Delta Tables |
| **Day 06** | ⏳ Pending | Delta Lake Deep Dive: V-Order, Time Travel, Schema Evolution |
| **Day 07** | ⏳ Pending | Dataflows Gen2 vs Pipelines vs Notebooks |
| **Day 08** | ⏳ Pending | OneLake Shortcuts: Cross-workspace & Multi-cloud |
| **Day 09** | ⏳ Pending | Mirrored Databases: Real-time Replication |
| **Day 10** | ⏳ Pending | Full vs Incremental Load Patterns |
| **Day 11** | ⏳ Pending | PySpark Batch Transformation Techniques |
| **Day 12** | ⏳ Pending | Denormalization & Star Schema in Fabric |
| **Day 13** | ⏳ Pending | Handling Duplicate, Missing & Late-Arriving Data |
| **Day 14** | ⏳ Pending | Data Warehouse vs Lakehouse SQL Endpoint |
| **Day 15** | ⏳ Pending | COPY INTO & CTAS in Fabric Data Warehouse |
| **Day 16** | ⏳ Pending | Cross-Database Querying with T-SQL |
| **Day 17** | ⏳ Pending | Row-Level, Column-Level & Object-Level Security |
| **Day 18** | ⏳ Pending | Dynamic Data Masking (DDM) |
| **Day 19** | ⏳ Pending | Monitoring DW Queries with DMVs |
| **Day 20** | ⏳ Pending | Real-Time Hub & Eventstream Architecture |
| **Day 21** | ⏳ Pending | Stream Transformation with Eventstreams |
| **Day 22** | ⏳ Pending | KQL Databases & Kusto Query Language |
| **Day 23** | ⏳ Pending | Native Tables vs Shortcuts in Real-Time Intelligence |
| **Day 24** | ⏳ Pending | Spark Structured Streaming in Fabric |
| **Day 25** | ⏳ Pending | Real-Time Dashboards & Data Activator |
| **Day 26** | ⏳ Pending | Git Integration & Workspace Version Control |
| **Day 27** | ⏳ Pending | Database Projects for Schema Management |
| **Day 28** | ⏳ Pending | Deployment Pipelines: Dev → Test → Production |
| **Day 29** | ⏳ Pending | Monitoring & Resolving Ingestion Errors |
| **Day 30** | ⏳ Pending | Spark, V-Order & DW Performance Optimization |

---

## 🎯 DP-700 Exam Blueprint (July 2026 update)

The official Microsoft exam is balanced equally across three major focus domains:

| Exam Domain | Weight | Core Focus Areas |
| :--- | :---: | :--- |
| **Implement & Manage Analytics** | 30–35% | Spark workspace custom pools, OneLake security, workspace governance, Git integration, deployment pipelines, orchestration. |
| **Ingest & Transform Data** | 30–35% | Batch & streaming ingestion, Dataflows Gen2, pipelines, notebooks (PySpark/Scala), T-SQL warehouse loading, KQL Eventhouse. |
| **Monitor & Optimize** | 30–35% | DMV performance monitoring, Spark optimizer logs, Data Warehouse optimization, Eventstream debugging. |

---

## 📁 Repository Directory Structure

```
.
├── LICENSE                          # Split license details (Content vs Code)
├── README.md                        # Master index and challenge overview
└── Day-01/
    ├── README.md                    # Day-specific study notes & slide index
    ├── carousel.html                # Microsoft Fabric Community style source HTML
    └── slides/
        ├── slide-01.png             # Rendered high-resolution slide 01 (1080x1350px)
        └── ...                      # Slides 02 through 10
```

---

## 🛡️ License and Copyright

This project uses a **split licensing model** to protect the original educational content while keeping utility code open:

*   **Slide Content, Written Material & Visual Designs:** **All Rights Reserved &copy; 2026 Sayan Banerjee**. Unauthorized reproduction, republishing, or redistribution of the carousel layouts or post copy is strictly prohibited.
*   **Tooling & Automation Scripts:** Licensed under the [MIT License](./LICENSE) (permissible for reuse and customization).

For questions or permission requests, contact: **work.sayanbanerjee@gmail.com**

---

## ⭐ Join the Journey

*   **LinkedIn Updates:** Follow my daily posts for technical deep-dives: [Sayan Banerjee on LinkedIn](https://www.linkedin.com/in/sayanbanerjee24).
*   **Contribute with a Star:** If you find these notes helpful, please drop a star ⭐ on the repository to support the initiative.
