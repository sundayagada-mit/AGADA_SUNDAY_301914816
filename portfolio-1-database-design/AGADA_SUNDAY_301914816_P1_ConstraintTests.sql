-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. pupil duplicate pk. Expected: pk_pupil, SQLSTATE 23505.
INSERT INTO portfolio."pupil" ("pupil_id", "grade_level")
VALUES (1001, 8);

-- 2. pupil invalid grade. Expected: pupil_grade_positive, SQLSTATE 23514.
INSERT INTO portfolio."pupil" ("pupil_id", "grade_level")
VALUES (1002, 0);

-- 3. staff duplicate pk. Expected: pk_staff_member, SQLSTATE 23505.
INSERT INTO portfolio."staff_member" ("staff_id", "role", "active")
VALUES (2001, 'administrator', TRUE);

-- 4. staff null role. Expected: role, SQLSTATE 23502.
INSERT INTO portfolio."staff_member" ("staff_id", "role", "active")
VALUES (2002, NULL, TRUE);

-- 5. visit duplicate pk. Expected: pk_visit, SQLSTATE 23505.
INSERT INTO portfolio."visit" ("visit_id", "pupil_id", "staff_id", "arrival_at", "symptoms", "outcome", "status")
VALUES (3001, 1001, 2001, '2026-10-13T10:00:00Z', 'cough', NULL, 'closed');

-- 6. visit missing pupil. Expected: fk_visit_0, SQLSTATE 23503.
INSERT INTO portfolio."visit" ("visit_id", "pupil_id", "staff_id", "arrival_at", "symptoms", "outcome", "status")
VALUES (3002, 9001, 2001, '2026-10-13T10:00:00Z', 'cough', NULL, 'closed');

-- 7. visit missing staff. Expected: fk_visit_1, SQLSTATE 23503.
INSERT INTO portfolio."visit" ("visit_id", "pupil_id", "staff_id", "arrival_at", "symptoms", "outcome", "status")
VALUES (3003, 1001, 9002, '2026-10-13T10:00:00Z', 'cough', NULL, 'closed');

-- 8. visit invalid status. Expected: visit_status_valid, SQLSTATE 23514.
INSERT INTO portfolio."visit" ("visit_id", "pupil_id", "staff_id", "arrival_at", "symptoms", "outcome", "status")
VALUES (3004, 1001, 2001, '2026-10-13T10:00:00Z', 'cough', NULL, 'pending');

-- 9. visit second open. Expected: pupil_one_open_visit, SQLSTATE 23505.
INSERT INTO portfolio."visit" ("visit_id", "pupil_id", "staff_id", "arrival_at", "symptoms", "outcome", "status")
VALUES (3005, 1001, 2001, '2026-10-13T10:00:00Z', 'cough', NULL, 'open');
