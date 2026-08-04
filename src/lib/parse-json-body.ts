import { NextResponse } from 'next/server';

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

export type ParsedJsonBody =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; response: NextResponse };

/** Parse JSON request body without throwing on empty or malformed input. */
export async function parseJsonObjectBody(request: Request): Promise<ParsedJsonBody> {
  const text = await request.text();
  if (!text.trim()) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Request body is required' }, { status: 400 }),
    };
  }

  try {
    const raw: unknown = JSON.parse(text);
    if (!isRecord(raw)) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
      };
    }
    return { ok: true, data: raw };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
    };
  }
}
