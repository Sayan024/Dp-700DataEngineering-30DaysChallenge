# 📖 Day 03 Study Guide: OneLake Settings & Access Control

> **Exam Focus:** DP-700: Implementing Data Engineering Solutions Using Microsoft Fabric  
> **Domain:** Implement & Manage Analytics (30–35%)  
> **Author:** Sayan Banerjee | Microsoft Certified: Fabric Data Engineer Associate  

---

## 🎯 Learning Objectives

By the end of this study guide, you will be able to:
1. Distinguish between **Workspace Roles**, **Item Permissions**, and **OneLake Data Access Roles**.
2. Configure **Read** vs **ReadData** permissions for Lakehouses and Data Warehouses.
3. Understand security inheritance and credential options for **OneLake Shortcuts**.
4. Evaluate when to use **Row-Level Security (RLS)**, **Column-Level Security (CLS)**, and **Dynamic Data Masking (DDM)** versus **OneLake Data Access Roles**.
5. Solve real-world DP-700 scenario questions on access control.

---

## 1. The 3 Security Layers in Microsoft Fabric

Security in Microsoft Fabric is structured in a **layered defense model** (Defense-in-Depth):

```
+-------------------------------------------------------------------+
|  Layer 1: Workspace Roles (Admin, Member, Contributor, Viewer)    |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|  Layer 2: Item Permissions (Read, ReadData, Write, Reshare, Exec) |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|  Layer 3: OneLake Data Access Roles (Folder, File, Delta Table)   |
+-------------------------------------------------------------------+
```

---

## 2. Layer 1: Workspace Roles Governance

Workspace roles provide **coarse-grained access control** across all items inside a Microsoft Fabric workspace.

| Workspace Role | Create/Edit Items | Delete Workspace | Manage Permissions | Read Data (Default) | Ideal User Persona |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Admin** | ✅ | ✅ | ✅ | ✅ | Fabric Capacity Admins / Lead Engineers |
| **Member** | ✅ | ❌ | ✅ (Reshare/Add Viewers) | ✅ | Senior Developers / Data Engineers |
| **Contributor** | ✅ | ❌ | ❌ | ✅ | ETL Developers / Data Analysts |
| **Viewer** | ❌ | ❌ | ❌ | ⚠️ Metadata Only* | Business Users / Executive Leadership |

> ⚠️ **DP-700 Exam Alert:**  
> A user assigned the **Viewer** workspace role can view item metadata and Power BI report visuals, but CANNOT read underlying Lakehouse files via Spark or SQL unless explicit **ReadData** item permissions are granted.

---

## 3. Layer 2: Item-Level Permissions

Item permissions allow administrators to grant access to specific Fabric items (Lakehouses, Warehouses, Pipelines, Notebooks) without granting access to the entire workspace.

### Core Item Permissions Matrix

```
       [ Item Permissions ]
                |
    +-----------+-----------+----------------+----------------+
    |           |           |                |                |
  Read       ReadData     Write           Reshare          Execute
(Metadata)  (OneLake)   (Modify)        (Grant Access)   (Pipelines)
```

- **Read:** Grants access to view the item in the workspace inventory and open connected Power BI reports.
- **ReadData:** Grants permissions to query underlying Delta tables and files via the SQL Analytics Endpoint or PySpark Notebooks.
- **Write:** Allows users to modify schemas, run `INSERT`/`UPDATE`/`DELETE` queries, and save notebook outputs.
- **Reshare:** Allows users to share the specific item with other organizational accounts.
- **Execute:** Required to run pipelines or trigger notebook execution jobs.

> 💡 **DP-700 Exam Formula:**  
> `SQL Analytics Endpoint Access = Read Permission + ReadData Permission`

---

## 4. Layer 3: OneLake Data Access Roles (Preview)

OneLake Data Access Roles enable **fine-grained, unified security** directly on OneLake storage path layers.

### Key Capabilities:
- **Folder & File Security:** Restrict access to specific subfolders inside the `Files/` directory of a Lakehouse.
- **Table-Level Security:** Control access to specific Delta tables inside `Tables/` regardless of compute engine (Spark, T-SQL, Power BI DirectLake).
- **Engine-Agnostic Enforcement:** Unlike SQL-based RLS which only applies to the SQL Endpoint, OneLake Data Access Roles are enforced across PySpark, SQL, and DirectLake simultaneously.

---

## 5. Security Inheritance for OneLake Shortcuts

OneLake Shortcuts create virtual links to external data (ADLS Gen2, Amazon S3, Google Cloud Storage, or other Fabric Lakehouses). 

Shortcuts support two distinct security inheritance modes:

```
[ Shortcut Ingestion ]
          |
          +---> User Identity Passthrough (Target Storage Access Required)
          |
          +---> Stored Organizational Credentials / Service Principal (Delegated)
```

| Shortcut Authentication Mode | User Storage Requirement | Security Behavior | DP-700 Best Use Case |
| :--- | :--- | :--- | :--- |
| **User Identity Passthrough** | User MUST have direct IAM/RBAC read access on target ADLS/S3 bucket. | Access is validated at query runtime against target storage provider. | Multi-cloud governance where target cloud IAM policies must be strictly honored. |
| **Delegated Organizational Identity** | User DOES NOT need direct access to target ADLS/S3 bucket. | Connection uses a stored Service Principal or organizational OAuth token. | Simplified enterprise access where Fabric controls overall data access. |

---

## 🧪 DP-700 Exam Practice Questions

### Question 1 (Workspace Governance & Roles)
**Scenario:** You are a Lead Data Engineer managing a Fabric Workspace. You need to grant a junior ETL developer permission to build and run Data Pipelines and modify PySpark Notebooks. However, the junior developer must NOT be able to add new users to the workspace or modify user roles.

Which workspace role should you assign?

- A) Admin
- B) Member
- C) Contributor
- D) Viewer

**Correct Answer:** **C) Contributor**  
**Explanation:** The **Contributor** role allows users to create, edit, and run items (Pipelines, Dataflows, Notebooks), but explicitly prevents them from managing workspace permissions or assigning roles. Members and Admins can manage permissions, while Viewers cannot create or edit items.

---

### Question 2 (Item Permissions & SQL Endpoint)
**Scenario:** A data analyst needs to query tables in a Fabric Lakehouse using SQL Server Management Studio (SSMS) via the SQL Analytics Endpoint. Currently, the analyst has the **Viewer** role in the workspace and can view the Lakehouse item, but encounters an access denied error when attempting to run `SELECT` queries against the tables.

What is the most secure and precise permission to grant the analyst?

- A) Upgrade the analyst's workspace role to Contributor.
- B) Grant the analyst the **ReadData** permission on the specific Lakehouse item.
- C) Grant the analyst the **Write** permission on the workspace.
- D) Assign the analyst the Admin role on the capacity.

**Correct Answer:** **B) Grant the analyst the ReadData permission on the specific Lakehouse item.**  
**Explanation:** Having the Viewer workspace role gives the analyst **Read** (metadata) permission. To query the actual data via the SQL Analytics Endpoint or SSMS, the user specifically requires **ReadData** item permission. Upgrading to Contributor or Admin grants excessive permissions.

---

### Question 3 (Shortcut Security & Multi-Cloud)
**Scenario:** An enterprise data engineering team creates a OneLake Shortcut inside a Fabric Lakehouse that references an Amazon S3 bucket containing financial transactions. Business users who have Viewer access to the Fabric workspace need to query this data. However, these business users DO NOT have AWS IAM accounts or direct access to the Amazon S3 bucket.

How should you configure the OneLake Shortcut connection?

- A) Use User Identity Passthrough authentication.
- B) Use Stored Organizational Credentials / Service Principal for shortcut authentication.
- C) Assign the business users AWS IAM Admin roles.
- D) Convert the Lakehouse into a Data Warehouse.

**Correct Answer:** **B) Use Stored Organizational Credentials / Service Principal for shortcut authentication.**  
**Explanation:** When users do not have direct access/accounts on the target cloud storage (S3/ADLS), the shortcut connection must be configured using **Delegated / Stored Credentials (Service Principal)**. This allows Fabric to authenticate to S3 using the stored credential while enforcing Fabric's internal permissions for the end users.

---

*End of Day 03 Study Guide — Microsoft Fabric DP-700 Certification Series.*
