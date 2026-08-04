/** Canonical labels for Previous IBD Surgeries — keep in sync with Patient-intake-form Step2DiseaseChar. */

export const PREVIOUS_IBD_SURGERY_OPTIONS = [
  'None',
  'Partial Colectomy',
  'Total Colectomy',
  'Ileo Caecal resection',
  'Perianal surgery',
  'Stricturoplasty',
  'Ostomy',
  'Segmental resection',
  'Other',
] as const;

const PREVIOUS_SURGERY_ALIASES: Record<string, string> = {
  'Ileocecal resection': 'Ileo Caecal resection',
  'Ostomy creation': 'Ostomy',
};

export function normalizePreviousSurgeryLabels(values: string[]): string[] {
  return values.map((value) => PREVIOUS_SURGERY_ALIASES[value] ?? value);
}
