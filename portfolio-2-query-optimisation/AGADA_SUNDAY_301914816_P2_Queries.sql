-- Show related visit, pupil, staff_member records (up to 20).
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

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
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

-- Find visit records where arrival_at matches "2026-10-12T09:15:00Z" (up to 20).
SELECT * FROM portfolio."visit"
WHERE "arrival_at" IS NOT DISTINCT FROM '2026-10-12T09:15:00Z'
ORDER BY "visit_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM portfolio."visit"
WHERE "arrival_at" IS NOT DISTINCT FROM '2026-10-12T09:15:00Z'
ORDER BY "visit_id"
LIMIT 20;

-- Count visit records for each pupil_id (up to 20 groups).
SELECT "pupil_id", count(*) AS record_count
FROM portfolio."visit"
GROUP BY "pupil_id"
ORDER BY record_count DESC, "pupil_id" NULLS LAST
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT "pupil_id", count(*) AS record_count
FROM portfolio."visit"
GROUP BY "pupil_id"
ORDER BY record_count DESC, "pupil_id" NULLS LAST
LIMIT 20;
