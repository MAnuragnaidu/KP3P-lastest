-- AlterTable
ALTER TABLE "Patient" ADD COLUMN "montrealAgeAtDiagnosis" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Patient" ADD COLUMN "diseaseLocation" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Patient" ADD COLUMN "diseaseBehavior" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Patient" ADD COLUMN "perianalDisease" TEXT NOT NULL DEFAULT '';
