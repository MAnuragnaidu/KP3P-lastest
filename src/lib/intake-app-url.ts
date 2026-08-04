function normalizeEnvUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  let trimmed = raw.trim().replace(/^['"]|['"]$/g, '');
  if (!trimmed) return null;
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

const INTAKE_URL_ENV_KEYS = [
  'INTAKE_APP_URL',
  'NEXT_PUBLIC_INTAKE_APP_URL',
  'PATIENT_INTAKE_URL',
] as const;

/**
 * Patient intake app URL (server-side).
 * Set INTAKE_APP_URL on Vercel — read at request time via /intake redirect.
 */
export function getIntakeAppUrl(): string | null {
  for (const key of INTAKE_URL_ENV_KEYS) {
    const url = normalizeEnvUrl(process.env[key]);
    if (url) return url;
  }
  return null;
}

export function isIntakeAppAvailable(): boolean {
  return getIntakeAppUrl() !== null;
}
