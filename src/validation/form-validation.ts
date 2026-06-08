import { z } from 'zod';
import { validateImageFile } from '../utils/image';

const genderSchema = z.enum(['female', 'male', 'other']);

const baseFormSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required.')
      .refine(
        (name) => name.charAt(0) === name.charAt(0).toUpperCase(),
        'Name must start with an uppercase letter.'
      ),
    age: z
      .number()
      .refine(Number.isFinite, 'Age must be a number.')
      .min(0, 'Age must not be negative.'),
    email: z
      .string()
      .min(1, 'Email is required.')
      .refine(isValidEmail, 'Email must contain one @ and a dotted domain.'),
    gender: genderSchema,
    acceptedTerms: z.boolean().refine(Boolean, 'Terms must be accepted.'),
    password: z.string().min(1, 'Password is required.'),
    confirmPassword: z.string().min(1, 'Confirm password is required.'),
    country: z.string().min(1, 'Country is required.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  });

const imageFileSchema = z
  .custom<File | undefined>()
  .superRefine((file, ctx) => {
    if (!file) {
      return;
    }

    const imageError = validateImageFile(file);

    if (imageError) {
      ctx.addIssue({
        code: 'custom',
        message: imageError,
      });
    }
  });

const fileListSchema = z
  .custom<FileList | undefined>()
  .superRefine((files, ctx) => {
    const imageError = validateImageFile(files?.[0]);

    if (imageError) {
      ctx.addIssue({
        code: 'custom',
        message: imageError,
      });
    }
  });

export function createUncontrolledFormSchema(countries: string[]) {
  return baseFormSchema
    .extend({
      imageFile: imageFileSchema,
    })
    .refine((values) => countries.includes(values.country), {
      message: 'Country must be selected from the list.',
      path: ['country'],
    });
}

export function createReactHookFormSchema(countries: string[]) {
  return baseFormSchema
    .extend({
      image: fileListSchema,
    })
    .refine((values) => countries.includes(values.country), {
      message: 'Country must be selected from the list.',
      path: ['country'],
    });
}

export function getValidationErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};

  error.issues.forEach((issue) => {
    const field = issue.path[0];

    if (typeof field === 'string' && !errors[field]) {
      errors[field] = issue.message;
    }
  });

  return errors;
}

function isValidEmail(email: string) {
  const parts = email.split('@');

  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domain] = parts;
  const domainParts = domain.split('.');

  return (
    localPart.length > 0 &&
    domainParts.length > 1 &&
    domainParts.every((part) => part.length > 0)
  );
}
