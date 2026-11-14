# School Sick-Bay System — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| pupil_id | visit records (list) |
| --- | --- |
| 1001 | [3001] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| visit.visit_id | visit.pupil_id | visit.staff_id | visit.symptoms | pupil.pupil_id | staff_member.staff_id | staff_member.role |
| --- | --- | --- | --- | --- | --- | --- |
| 3001 | 1001 | 2001 | headache | 1001 | 2001 | nurse |

Key: visit_id.

## 2NF: depend on the whole key

The declared candidate keys do not introduce a partial dependency here, so the 1NF rows stay unchanged at this step.

## visit_example

| visit.visit_id | visit.pupil_id | visit.staff_id | visit.symptoms | pupil.pupil_id | staff_member.staff_id | staff_member.role |
| --- | --- | --- | --- | --- | --- | --- |
| 3001 | 1001 | 2001 | headache | 1001 | 2001 | nurse |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## pupil

| pupil_id | grade_level |
| --- | --- |
| 1001 | 7 |

## staff_member

| staff_id | role | active |
| --- | --- | --- |
| 2001 | nurse | true |

## visit

| visit_id | pupil_id | staff_id | arrival_at | symptoms | outcome | status |
| --- | --- | --- | --- | --- | --- | --- |
| 3001 | 1001 | 2001 | 2026-10-12T09:15:00+00:00 | headache | NULL | open |

## Dependencies

- pupil: (pupil_id) → grade_level
- staff_member: (staff_id) → role, active
- visit: (visit_id) → pupil_id, staff_id, arrival_at, symptoms, outcome, status

Joining the decomposed sample tables reproduces the original 1 example rows. The design assumes the declared keys describe the relevant business dependencies.
