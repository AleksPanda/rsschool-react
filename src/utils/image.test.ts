import { describe, expect, it } from 'vitest';
import { getImageDataUrl, validateImageFile } from './image';

describe('image utilities', () => {
  it('requires an image file', () => {
    expect(validateImageFile()).toBe('Profile image is required.');
  });

  it('validates image type and size', () => {
    expect(
      validateImageFile(
        new File(['avatar'], 'avatar.gif', { type: 'image/gif' })
      )
    ).toBe('Only PNG and JPEG images are allowed.');
    expect(
      validateImageFile(
        new File([new Uint8Array(1024 * 1024 + 1)], 'avatar.png', {
          type: 'image/png',
        })
      )
    ).toBe('Image size must be less than 1 MB.');
  });

  it('converts a valid file to a base64 data url', async () => {
    await expect(
      getImageDataUrl(new File(['avatar'], 'avatar.png', { type: 'image/png' }))
    ).resolves.toBe('data:image/png;base64,YXZhdGFy');
  });
});
