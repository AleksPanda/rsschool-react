const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg'];
const MAX_IMAGE_SIZE = 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only PNG and JPEG images are allowed.';
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return 'Image size must be less than 1 MB.';
  }

  return null;
}

export async function getImageDataUrl(file?: File): Promise<string> {
  if (!file || file.size === 0) {
    return '';
  }

  const imageError = validateImageFile(file);

  if (imageError) {
    throw new Error(imageError);
  }

  return convertFileToBase64(file);
}

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Failed to convert image to base64.'));
    });

    reader.addEventListener('error', () => {
      reject(new Error('Failed to read image file.'));
    });

    reader.readAsDataURL(file);
  });
}
