import { describe, expect, it } from 'vitest';
import {
  createReactHookFormSchema,
  createUncontrolledFormSchema,
  getValidationErrors,
} from './form-validation';

const countries = ['Israel', 'France'];

describe('form validation schemas', () => {
  it('validates basic form rules and country membership', () => {
    const result = createUncontrolledFormSchema(countries).safeParse({
      name: 'aleksandra',
      age: -1,
      email: 'broken-email',
      gender: 'female',
      acceptedTerms: false,
      password: 'Password1!',
      confirmPassword: 'Password2!',
      country: 'Atlantis',
      imageFile: undefined,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(getValidationErrors(result.error)).toMatchObject({
        name: 'Name must start with an uppercase letter.',
        age: 'Age must not be negative.',
        email: 'Email must contain one @ and a dotted domain.',
        acceptedTerms: 'Terms must be accepted.',
        imageFile: 'Profile image is required.',
        confirmPassword: 'Passwords must match.',
        country: 'Country must be selected from the list.',
      });
    }
  });

  it('accepts valid React Hook Form values', () => {
    const result = createReactHookFormSchema(countries).safeParse({
      name: 'Aleksandra',
      age: 28,
      email: 'aleksandra@example.com',
      gender: 'female',
      acceptedTerms: true,
      password: 'Password1!',
      confirmPassword: 'Password1!',
      country: 'Israel',
      image: createFileList(
        new File(['avatar'], 'avatar.png', { type: 'image/png' })
      ),
    });

    expect(result.success).toBe(true);
  });
});

function createFileList(file: File): FileList {
  return {
    0: file,
    length: 1,
    item: (index: number) => (index === 0 ? file : null),
    [Symbol.iterator]: function* () {
      yield file;
    },
  } as unknown as FileList;
}
