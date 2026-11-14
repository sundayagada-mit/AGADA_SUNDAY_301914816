# School Sick-Bay System — database design

My case study records pupil, staff_member, visit.

## Users

- Sick-bay staff recording visits
- School administrators reviewing visit activity

## Main operations

- Record a visit with its arrival time, pupil, responsible staff member, symptoms, and status.
- Review visit details and summarize visit counts by staff member.

## Entities

| Entity | Information stored |
| --- | --- |
| pupil | Stores a synthetic pupil key and grade level for associating visits with a school grade. |
| staff_member | Stores a synthetic staff key, role, and active status. |
| visit | Records a sick-bay visit and references its pupil and responsible staff member. |

## pupil

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| pupil_id | BIGINT | PK | Yes |
| grade_level | INTEGER |  | Yes |


## staff_member

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| staff_id | BIGINT | PK | Yes |
| role | TEXT |  | Yes |
| active | BOOLEAN |  | Yes |


## visit

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| visit_id | BIGINT | PK | Yes |
| pupil_id | BIGINT | FK | Yes |
| staff_id | BIGINT | FK | Yes |
| arrival_at | TIMESTAMPTZ |  | Yes |
| symptoms | TEXT |  | Yes |
| outcome | TEXT |  | No |
| status | TEXT |  | Yes |
- pupil_id → pupil.pupil_id
- staff_id → staff_member.staff_id

## Relationships and business rules

- A pupil's grade level must be a positive integer.
- Every visit must reference an existing pupil.
- Every visit must reference an existing staff member.
- A visit status must be open or closed.
- A pupil may have at most one open visit; enforce a partial unique constraint on pupil_id for visits whose status is open.

## Assumptions

- Each visit concerns one pupil and has one responsible staff member; each pupil and staff member may be associated with many visits.
- A visit is either open or closed. A pupil may have at most one open visit at a time.
- Generated primary-key values are synthetic and globally unique across entity tables.
- Normalization example: start with visit as the root record, which references pupil. If a visit record repeats the pupil's grade, move grade_level to pupil and retain pupil_id as the visit foreign key; this removes the repeated pupil attribute from visit.
- Benchmark plan: generate 20000 synthetic visit rows, compare arrival-time range filtering before and after a B-tree index on visit.arrival_at, and record query plans and elapsed time under the same test conditions.

