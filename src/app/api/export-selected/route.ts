import type { Character } from '../../../types';
import { createCharactersCsv } from '../../../utils/csv';

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  if (!Array.isArray(payload) || payload.length === 0) {
    return Response.json(
      { error: 'At least one character is required.' },
      { status: 400 }
    );
  }

  try {
    const characters = payload as Character[];
    const csv = createCharactersCsv(characters, new URL(request.url).origin);

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${characters.length}_items.csv"`,
      },
    });
  } catch {
    return Response.json({ error: 'Invalid character data.' }, { status: 400 });
  }
}
