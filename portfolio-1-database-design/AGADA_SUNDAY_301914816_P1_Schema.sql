-- School Sick-Bay System: tables, keys and business constraints.
-- Run once in a fresh PostgreSQL database.
BEGIN;
SET LOCAL standard_conforming_strings = on;
CREATE SCHEMA portfolio;
CREATE TABLE portfolio."pupil" (
  "pupil_id" bigint NOT NULL,
  "grade_level" bigint NOT NULL,
  CONSTRAINT "pk_pupil" PRIMARY KEY ("pupil_id")
);
CREATE TABLE portfolio."staff_member" (
  "staff_id" bigint NOT NULL,
  "role" text NOT NULL,
  "active" boolean NOT NULL,
  CONSTRAINT "pk_staff_member" PRIMARY KEY ("staff_id")
);
CREATE TABLE portfolio."visit" (
  "visit_id" bigint NOT NULL,
  "pupil_id" bigint NOT NULL,
  "staff_id" bigint NOT NULL,
  "arrival_at" timestamptz NOT NULL,
  "symptoms" text NOT NULL,
  "outcome" text,
  "status" text NOT NULL,
  CONSTRAINT "pk_visit" PRIMARY KEY ("visit_id")
);
ALTER TABLE portfolio."visit" ADD CONSTRAINT "fk_visit_0" FOREIGN KEY ("pupil_id") REFERENCES portfolio."pupil" ("pupil_id");
ALTER TABLE portfolio."visit" ADD CONSTRAINT "fk_visit_1" FOREIGN KEY ("staff_id") REFERENCES portfolio."staff_member" ("staff_id");
ALTER TABLE portfolio."pupil" ADD CONSTRAINT "pupil_grade_positive" CHECK ("grade_level" > 0);
ALTER TABLE portfolio."visit" ADD CONSTRAINT "visit_status_valid" CHECK (("status" = 'open') OR ("status" = 'closed'));
CREATE UNIQUE INDEX "pupil_one_open_visit" ON portfolio."visit" ("pupil_id") WHERE ("status" = 'open');
COMMIT;
