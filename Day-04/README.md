# 📅 Day 04 — Apache Airflow & Pipeline Orchestration in Microsoft Fabric

This folder contains the complete study materials and resources for Day 04 of the DP-700 Microsoft Fabric Data Engineering 30-Day Challenge.

👉 **[📖 Read Full Day 04 Study Guide & Practice Questions (study-guide.md)](study-guide.md)**  
👉 **[📢 Read LinkedIn Post Copy & Hashtags (post-copy.md)](post-copy.md)**  
👉 **[🖼️ View Editable Slide Source HTML (carousel.html)](carousel.html)**

---

## 🖼️ Carousel Slides Preview

These slides are designed in the official Microsoft Fabric Community style. 

*Click on any slide to view the high-resolution version.*

<div align="center">

![Slide 01: Cover](slides/slide-01.png)
*Slide 1 — Cover & Introduction*

![Slide 02: 4 Orchestration Tools](slides/slide-02.png)
*Slide 2 — Data Pipelines vs Airflow vs Notebooks vs Dataflows*

![Slide 03: Where to Configure Airflow](slides/slide-03.png)
*Slide 3 — Workspace Settings Configuration Boundary*

![Slide 04: #1 Scheduling Exam Trap](slides/slide-04.png)
*Slide 4 — Notebook Scheduling Rules*

![Slide 05: Python DAG Definition](slides/slide-05.png)
*Slide 5 — Airflow Python Code Example*

![Slide 06: Pipelines vs Airflow](slides/slide-06.png)
*Slide 6 — Visual GUI vs Code-First DAGs*

![Slide 07: Pipeline Triggers](slides/slide-07.png)
*Slide 7 — Schedule, Storage Event & Webhook Triggers*

![Slide 08: Exam Decision Matrix](slides/slide-08.png)
*Slide 8 — Orchestration Selection Cheat Sheet*

![Slide 09: Pro Tip](slides/slide-09.png)
*Slide 9 — Workspace Boundary Exam Tip*

![Slide 10: CTA](slides/slide-10.png)
*Slide 10 — Call to Action & About the Author*

</div>

---

## 📝 Study Notes & Highlights

### 1. 4 Orchestration Engines in Fabric
*   **Data Factory Pipelines:** Visual drag-and-drop GUI for ETL, copy activities, and schedule/storage event triggers.
*   **Apache Airflow Jobs:** Python code-first DAG orchestration managed at **Workspace Settings**.
*   **PySpark Notebooks:** Heavy transformation engine; **CANNOT self-schedule directly**.
*   **Dataflows Gen2:** Low-code Power Query M transformation engine.

### 2. Airflow Configuration Boundary
*   Configured strictly in **Workspace Settings &rarr; Data Engineering &rarr; Apache Airflow**.
*   Upload custom `requirements.txt` for PyPI dependencies across the workspace.

---

## 📂 Files in this Folder

*   [study-guide.md](study-guide.md) — Comprehensive Day 04 Study Guide & DP-700 Practice Questions.
*   [Day-04-Airflow-Orchestration-Carousel.pdf](Day-04-Airflow-Orchestration-Carousel.pdf) — Compiled 10-slide PDF carousel for LinkedIn Document posts.
*   [post-copy.md](post-copy.md) — The optimized LinkedIn post copy and comment text.
*   [carousel.html](carousel.html) — The editable HTML/CSS source code of the slides.
*   [slides/](slides/) — Directory containing all 10 exported PNG slide images.
