/** Clear session via API and redirect to the login page. */
export async function performLogout(): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });

    const text = await res.text();
    let data: { error?: string } | null = null;
    if (text) {
      try {
        data = JSON.parse(text) as { error?: string };
      } catch {
        if (!res.ok) {
          return { ok: false, error: 'Log out failed. Please try again.' };
        }
      }
    }

    if (!res.ok) {
      return { ok: false, error: data?.error ?? 'Log out failed. Please try again.' };
    }

    window.location.assign('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error. Please check your connection and try again.' };
  }
}
