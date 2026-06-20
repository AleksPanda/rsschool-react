import { describe, expect, it } from 'vitest';

import { mockCharacter } from '../../../test-utils/mock-character';
import { POST } from './route';

describe('POST /api/export-selected', () => {
  it('returns selected characters as a CSV attachment', async () => {
    const request = new Request('http://localhost/api/export-selected', {
      method: 'POST',
      body: JSON.stringify([mockCharacter]),
    });

    const response = await POST(request);
    const csv = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(
      'text/csv; charset=utf-8'
    );
    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="1_items.csv"'
    );
    expect(csv).toContain('id,name,description');
    expect(csv).toContain(mockCharacter.name);
    expect(csv).toContain(`details=${mockCharacter.id}`);
  });

  it('rejects an empty selection', async () => {
    const request = new Request('http://localhost/api/export-selected', {
      method: 'POST',
      body: JSON.stringify([]),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('rejects invalid JSON', async () => {
    const request = new Request('http://localhost/api/export-selected', {
      method: 'POST',
      body: 'not-json',
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
