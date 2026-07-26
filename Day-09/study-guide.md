# Day 09 Study Guide — Configure Security & Governance

> **DP-700 Domain:** Implement and manage an analytics solution (30–35%)
> **Skills covered:**
> - Implement workspace-level access controls
> - Implement item-level access controls
> - Implement row-level, column-level, object-level, and folder/file-level access controls
> - Implement dynamic data masking
> - Apply sensitivity labels to items & Endorse items
> - Configure and implement OneLake security

---

## 🎯 What You Must Know for DP-700

Security configuration in Microsoft Fabric is granular and spans multiple layers. The exam tests your ability to configure:
1. **Workspace Roles**: Admin, Member, Contributor, Viewer permissions.
2. **Item-Level Permissions**: Read, Share, Reshare, ReadAll (for SQL Endpoint), ReadData.
3. **Engine Security (T-SQL)**: Row-Level Security (RLS), Column-Level Security (CLS), and Dynamic Data Masking (DDM) in the Data Warehouse/SQL Endpoint.
4. **OneLake Data Access Roles (Preview)**: Folder-level and file-level security matching storage structures.
5. **Information Protection**: Sensitivity labels (Microsoft Purview) and endorsements (Promoted vs. Certified).

---

## 📘 Section 1: Workspace Roles vs. Item Permissions

### 1. Workspace-Level Roles

Workspace roles define permissions for **all items** inside a workspace.

| Role | Permissions | Best Used For |
|---|---|---|
| **Admin** | Full control, edit workspace, add/delete users, configure settings. | Admins, capacity administrators |
| **Member** | Create, edit, and delete items. Can add users to lower roles. | Development leads, co-creators |
| **Contributor** | Create, edit, and delete items. Cannot manage workspace access. | Data engineers, analysts |
| **Viewer** | Read and view all items. Cannot edit code, tables, or settings. | Business consumers, report viewers |

### 2. Item-Level Permissions (Sharing)
Enables sharing specific items (e.g., a specific Lakehouse or report) without giving access to the entire workspace.
- **Read:** Open and view the item metadata.
- **ReadData (Lakehouse/Warehouse):** Query data using SQL Analytics Endpoint or Spark.
- **ReadAll (Lakehouse):** View unstructured files in OneLake using Spark/File API.

---

## 📘 Section 2: Advanced Data & Database Security (SQL Engine)

Applied to **Data Warehouse** and **Lakehouse SQL Analytics Endpoint** using standard T-SQL:

### 1. Row-Level Security (RLS)
Restricts row access based on user context (e.g., users only see sales from their region). Implemented using a **Security Predicate** (table-valued function) bound to the table.

```sql
-- Create Security Function
CREATE FUNCTION Security.fn_securitypredicate(@Region AS sysname)
    RETURNS TABLE
WITH SCHEMABINDING
AS
    RETURN SELECT 1 AS fn_securitypredicate_result
    WHERE @Region = USER_NAME() OR USER_NAME() = 'SalesManager';
GO

-- Bind Predicate to Table
CREATE SECURITY POLICY Security.FilterSales
ADD FILTER PREDICATE Security.fn_securitypredicate(Region)
ON dbo.Sales
WITH (STATE = ON);
```

### 2. Column-Level Security (CLS)
Restricts access to specific columns containing sensitive data (e.g., hiding `SocialSecurityNumber` or `Salary`).

```sql
-- Grant SELECT access only on specific columns to a user role
GRANT SELECT ON dbo.Employee(EmployeeID, FirstName, LastName) TO SalesRole;
```

### 3. Dynamic Data Masking (DDM)
Masks sensitive data on the fly (e.g., showing only the last 4 digits of a credit card `XXXX-XXXX-XXXX-1234`).
- **Default mask:** Replaces all letters/numbers with `XXXX`/`0`.
- **Email mask:** Preserves first letter and `.com` suffix (e.g., `sXXXX@XXXX.com`).
- **Partial mask:** Custom padding (e.g., `partial(2, "XXXX", 2)`).

```sql
ALTER TABLE dbo.Customers
ALTER COLUMN CreditCard ADD MASKED WITH (FUNCTION = 'partial(0, \"XXXX-XXXX-XXXX-\", 4)');
```

---

## 📘 Section 3: OneLake Security & Data Access Roles

OneLake security can be managed at the storage layer, decoupling security from the query engines (Spark vs. SQL endpoint).

### OneLake Data Access Roles
- Unified security model that applies across **all engines** (Spark, T-SQL, shortcuts).
- Configure roles targeting **specific folders** in a Lakehouse (`Files` or `Tables`).
- Avoids writing separate security logic for SQL (views/RLS) and Spark (filters).

### Exam Tip ⚠️
> **Folder Security in OneLake:** If you restrict access to a folder using OneLake Data Access Roles, that restriction is enforced regardless of whether the user queries via Spark, SQL endpoint, or a Shortcut!

---

## 📘 Section 4: Governance & Endorsement

Microsoft Fabric uses Microsoft Purview sensitivity labels and endorsement structures to govern data discovery.

### 1. Endorsement States
- **Promoted:** Highlights items to indicate they are verified for consumption (anyone with write access can promote).
- **Certified:** Higher standard indicating strict quality review and trust. Only authorized workspace administrators or curators can certify items.

### 2. Sensitivity Labels
- Purview-backed labels (e.g., *Confidential*, *Public*, *Highly Sensitive*) that travel with the data.
- Applying a sensitivity label to a semantic model automatically propagates that label to reports created from it downstream (Lineage inheritance).

---

## 📝 3 DP-700 Practice Questions

### Question 1
A business analyst needs to write Power BI reports against a Fabric Lakehouse. They must query tables via the SQL Analytics Endpoint but should NOT be able to modify, add, or delete any tables or code inside the workspace. Which configuration is most appropriate?

- A) Assign the workspace Contributor role to the user.
- B) Assign the workspace Viewer role, and grant them Read and ReadData item permissions on the Lakehouse.
- C) Assign the workspace Member role.
- D) Create a custom Spark pool for the user.

> **Answer: B** — The workspace Viewer role prevents the user from modifying workspace items. Granting Read and ReadData permissions at the item level allows them to query the SQL endpoint.

---

### Question 2
You need to prevent human resource managers from viewing the `BaseSalary` column in a table named `dbo.Employees` inside a Fabric Data Warehouse, while allowing them to view other employee details. Which security mechanism is designed for this scenario?

- A) Row-Level Security (RLS)
- B) Dynamic Data Masking (DDM)
- C) Column-Level Security (CLS)
- D) OneLake Data Access Roles

> **Answer: C** — Column-Level Security (CLS) restricts access to specific columns (like BaseSalary) for specific users or database roles while leaving other columns accessible.

---

### Question 3
You want to ensure that a highly sensitive financial Lakehouse is recognized as the "single source of truth" across the enterprise. You want only authorized workspace administrators to apply this trust level. Which endorsement status should be used?

- A) Promoted
- B) Certified
- C) Confidential
- D) Highly Restricted

> **Answer: B** — "Certified" is the highest endorsement level and requires admin/curator privileges to set. "Promoted" can be set by any content author. "Confidential" is a sensitivity label, not an endorsement.

---

## 🔗 Official Microsoft Learn References
- [Workspace-level roles in Fabric](https://learn.microsoft.com/en-us/fabric/get-started/roles-workspaces)
- [Row-level security in Fabric Data Warehousing](https://learn.microsoft.com/en-us/fabric/data-warehouse/row-level-security)
- [OneLake security overview](https://learn.microsoft.com/en-us/fabric/onelake/onelake-security)
- [Endorse Fabric items](https://learn.microsoft.com/en-us/fabric/get-started/endorse-items)
