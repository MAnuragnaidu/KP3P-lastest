function isLocalhostUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

/**
 * Patient intake app URL (server-side).
 * Set INTAKE_APP_URL (preferred) or NEXT_PUBLIC_INTAKE_APP_URL — no code fallback.
 */
export function getIntakeAppUrl(): string | null {
  const configured =
    process.env.INTAKE_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_INTAKE_APP_URL?.trim();

  if (!configured) return null;

  if (process.env.NODE_ENV === 'production' && isLocalhostUrl(configured)) {
    return null;
  }

  return configured;
}

export function isIntakeAppAvailable(): boolean {
  return getIntakeAppUrl() !== null;
}
