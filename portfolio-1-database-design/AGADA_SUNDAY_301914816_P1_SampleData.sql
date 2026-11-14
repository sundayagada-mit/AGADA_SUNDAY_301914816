-- Fictional sample records for School Sick-Bay System.
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."pupil" ("pupil_id", "grade_level") VALUES (1001, 7);
INSERT INTO portfolio."staff_member" ("staff_id", "role", "active") VALUES (2001, 'nurse', TRUE);
INSERT INTO portfolio."visit" ("visit_id", "pupil_id", "staff_id", "arrival_at", "symptoms", "outcome", "status") VALUES (3001, 1001, 2001, '2026-10-12T09:15:00Z', 'headache', NULL, 'open');
COMMIT;
