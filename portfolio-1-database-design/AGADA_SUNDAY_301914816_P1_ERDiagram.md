# School Sick-Bay System — ER diagram

```mermaid
erDiagram
    direction LR
    pupil {
        bigint pupil_id PK
        integer grade_level
    }
    staff_member {
        bigint staff_id PK
        text role
        boolean active
    }
    visit {
        bigint visit_id PK
        bigint pupil_id FK
        bigint staff_id FK
        timestamptz arrival_at
        text symptoms
        text outcome "Optional"
        text status
    }
    pupil ||--o{ visit : "pupil_id"
    staff_member ||--o{ visit : "staff_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/AGADA_SUNDAY_301914816_ERDiagram.png)
