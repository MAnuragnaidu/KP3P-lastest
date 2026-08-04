-- Specialist assessment notes (surgeon, radiologist, dietitian)
ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "surgeonSurgicalHistory" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "radiologistFindings" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "dietitianDietaryFindings" TEXT NOT NULL DEFAULT '';
