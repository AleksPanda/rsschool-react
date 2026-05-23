import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mockCharacter } from '../test-utils/mock-character';
import {
  createSelectedCharactersCsv,
  downloadSelectedCharactersCsv,
} from './download-selected-characters';

describe('download selected characters utils', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates csv with headers and character data', () => {
    const csv = createSelectedCharactersCsv([mockCharacter]);

    expect(csv).toContain(
      'id,name,description,status,species,type,gender,origin,location,episodesCount,imageUrl,detailsUrl'
    );

    expect(csv).toContain(String(mockCharacter.id));
    expect(csv).toContain(mockCharacter.name);
    expect(csv).toContain(mockCharacter.status);
    expect(csv).toContain(mockCharacter.species);
    expect(csv).toContain(mockCharacter.gender);
    expect(csv).toContain(mockCharacter.origin.name);
    expect(csv).toContain(mockCharacter.location.name);
    expect(csv).toContain(mockCharacter.image);
    expect(csv).toContain(`details=${mockCharacter.id}`);
  });

  it('uses selected characters count in downloaded file name', () => {
    const downloadLink = document.createElement('a');
    const clickSpy = vi
      .spyOn(downloadLink, 'click')
      .mockImplementation(() => {});

    vi.spyOn(document, 'createElement').mockReturnValue(downloadLink);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    downloadSelectedCharactersCsv([mockCharacter]);

    expect(downloadLink.href).toBe('blob:mock-url');
    expect(downloadLink.download).toBe('1_items.csv');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('revokes created object url after download', () => {
    const downloadLink = document.createElement('a');

    vi.spyOn(document, 'createElement').mockReturnValue(downloadLink);
    vi.spyOn(downloadLink, 'click').mockImplementation(() => {});
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    const revokeObjectUrlSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});

    downloadSelectedCharactersCsv([mockCharacter]);

    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:mock-url');
  });

  it('does not download csv when selected characters list is empty', () => {
    const createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL');
    const createElementSpy = vi.spyOn(document, 'createElement');

    downloadSelectedCharactersCsv([]);

    expect(createObjectUrlSpy).not.toHaveBeenCalled();
    expect(createElementSpy).not.toHaveBeenCalled();
  });
});
