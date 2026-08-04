function normalizeEnvUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().replace(/^['"]|['"]$/g, '');
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

/**
 * Patient intake app URL (server-side only).
 * Set INTAKE_APP_URL on Vercel (runtime, no rebuild needed when changed).
 * NEXT_PUBLIC_INTAKE_APP_URL is a build-time fallback.
 */
export function getIntakeAppUrl(): string | null {
  return (
    normalizeEnvUrl(process.env.INTAKE_APP_URL) ||
    normalizeEnvUrl(process.env.NEXT_PUBLIC_INTAKE_APP_URL)
  );
}

export function isIntakeAppAvailable(): boolean {
  return getIntakeAppUrl() !== null;
}
