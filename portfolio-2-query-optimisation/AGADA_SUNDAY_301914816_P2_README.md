# School Sick-Bay System — SQL queries

## 1. Show related visit, pupil, staff_member records (up to 20).

```sql
SELECT t0."visit_id" AS "visit_visit_id",
       t0."arrival_at" AS "visit_arrival_at",
       t1."pupil_id" AS "pupil_pupil_id",
       t1."grade_level" AS "pupil_grade_level",
       t2."staff_id" AS "staff_member_staff_id",
       t2."role" AS "staff_member_role"
FROM portfolio."visit" t0
JOIN portfolio."pupil" t1 ON t0."pupil_id" = t1."pupil_id"
JOIN portfolio."staff_member" t2 ON t0."staff_id" = t2."staff_id"
ORDER BY t0."visit_id", t1."pupil_id", t2."staff_id"
LIMIT 20;
```

| visit_visit_id | visit_arrival_at | pupil_pupil_id | pupil_grade_level | staff_member_staff_id | staff_member_role |
| --- | --- | --- | --- | --- | --- |
| 3001 | 2026-10-12T09:15:00+00:00 | 1001 | 7 | 2001 | nurse |

## 2. Find visit records where arrival_at matches "2026-10-12T09:15:00Z" (up to 20).

```sql
SELECT * FROM portfolio."visit"
WHERE "arrival_at" IS NOT DISTINCT FROM '2026-10-12T09:15:00Z'
ORDER BY "visit_id"
LIMIT 20;
```

| visit_id | pupil_id | staff_id | arrival_at | symptoms | outcome | status |
| --- | --- | --- | --- | --- | --- | --- |
| 3001 | 1001 | 2001 | 2026-10-12T09:15:00+00:00 | headache | NULL | open |

## 3. Count visit records for each pupil_id (up to 20 groups).

```sql
SELECT "pupil_id", count(*) AS record_count
FROM portfolio."visit"
GROUP BY "pupil_id"
ORDER BY record_count DESC, "pupil_id" NULLS LAST
LIMIT 20;
```

| pupil_id | record_count |
| --- | --- |
| 1001 | 1 |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 0.998 | 0.988, 0.998, 2.506 | Sort → Seq Scan | 112 |
| After index | 0.193 | 0.193, 0.32, 0.193 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 25 |

The median execution time changed from 0.998 ms to 0.193 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=0.959..0.961 rows=20 loops=1)
  Seq Scan on visit (actual time=0.015..0.926 rows=20 loops=1)
Planning Time: 0.406 ms
Execution Time: 0.988 ms
```

### Before index, run 2

```text
Sort (actual time=0.968..0.97 rows=20 loops=1)
  Seq Scan on visit (actual time=0.016..0.934 rows=20 loops=1)
Planning Time: 0.393 ms
Execution Time: 0.998 ms
```

### Before index, run 3

```text
Sort (actual time=2.468..2.47 rows=20 loops=1)
  Seq Scan on visit (actual time=0.022..2.424 rows=20 loops=1)
Planning Time: 0.431 ms
Execution Time: 2.506 ms
```

### After index, run 1

```text
Sort (actual time=0.132..0.134 rows=20 loops=1)
  Bitmap Heap Scan on visit (actual time=0.024..0.095 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.015..0.015 rows=20 loops=1)
Planning Time: 0.577 ms
Execution Time: 0.193 ms
```

### After index, run 2

```text
Sort (actual time=0.231..0.233 rows=20 loops=1)
  Bitmap Heap Scan on visit (actual time=0.051..0.142 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.02..0.02 rows=20 loops=1)
Planning Time: 0.545 ms
Execution Time: 0.32 ms
```

### After index, run 3

```text
Sort (actual time=0.132..0.134 rows=20 loops=1)
  Bitmap Heap Scan on visit (actual time=0.024..0.097 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.014..0.015 rows=20 loops=1)
Planning Time: 0.57 ms
Execution Time: 0.193 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run AGADA_SUNDAY_301914816_P2_Queries.sql, then AGADA_SUNDAY_301914816_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/AGADA_SUNDAY_301914816_P2_QueryResults.png) · [Index comparison](screenshots/AGADA_SUNDAY_301914816_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

