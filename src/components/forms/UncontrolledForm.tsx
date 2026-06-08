import { type SubmitEventHandler, useState } from 'react';
import { GENDER_OPTIONS } from '../../constants/form-options';
import { useCountriesStore } from '../../store/countries-store';
import type { FormSubmission, FormValues } from '../../types/form';
import { getImageDataUrl } from '../../utils/image';
import {
  createUncontrolledFormSchema,
  getValidationErrors,
} from '../../validation/form-validation';
import { FormField } from './FormField';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

type UncontrolledFormProps = {
  onSubmit: (values: FormValues) => void;
};

export function UncontrolledForm({ onSubmit }: UncontrolledFormProps) {
  const countries = useCountriesStore((state) => state.countries);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const imageInput = event.currentTarget.elements.namedItem(
      'image'
    ) as HTMLInputElement | null;
    const age = Number(formData.get('age'));
    const formValues = {
      name: String(formData.get('name') ?? ''),
      age,
      email: String(formData.get('email') ?? ''),
      gender: String(
        formData.get('gender') ?? 'other'
      ) as FormSubmission['gender'],
      acceptedTerms: formData.get('acceptedTerms') === 'on',
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
      country: String(formData.get('country') ?? ''),
      imageFile: imageInput?.files?.[0],
    };
    const result =
      createUncontrolledFormSchema(countries).safeParse(formValues);

    if (!result.success) {
      setErrors(getValidationErrors(result.error));
      return;
    }

    let image = '';
    try {
      image = await getImageDataUrl(result.data.imageFile);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to read image.');
      return;
    }

    setErrors({});
    onSubmit({
      name: result.data.name,
      age: result.data.age,
      email: result.data.email,
      gender: result.data.gender,
      acceptedTerms: result.data.acceptedTerms,
      image,
      password: result.data.password,
      confirmPassword: result.data.confirmPassword,
      country: result.data.country,
    });
  };

  return (
    <form
      aria-label="Uncontrolled form"
      className="form"
      onSubmit={handleSubmit}
      noValidate
    >
      <FormField htmlFor="uncontrolled-name" label="Name" error={errors.name}>
        <input
          id="uncontrolled-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          data-modal-initial-focus
        />
      </FormField>

      <FormField htmlFor="uncontrolled-age" label="Age" error={errors.age}>
        <input id="uncontrolled-age" name="age" type="number" required />
      </FormField>

      <FormField
        htmlFor="uncontrolled-email"
        label="Email"
        error={errors.email}
      >
        <input
          id="uncontrolled-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </FormField>

      <FormField
        htmlFor="uncontrolled-gender"
        label="Gender"
        error={errors.gender}
      >
        <select id="uncontrolled-gender" name="gender" required>
          {GENDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <div className="form__checkbox">
        <input
          id="uncontrolled-terms"
          name="acceptedTerms"
          type="checkbox"
          required
        />
        <label htmlFor="uncontrolled-terms">Accept Terms and Conditions</label>
      </div>
      <p className="form__error">{errors.acceptedTerms}</p>

      <FormField
        htmlFor="uncontrolled-image"
        label="Profile image"
        error={errors.imageFile}
      >
        <input
          id="uncontrolled-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg"
          required
        />
      </FormField>

      <FormField
        htmlFor="uncontrolled-password"
        label="Password"
        error={errors.password}
      >
        <input
          id="uncontrolled-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
      </FormField>

      <PasswordStrengthIndicator password={password} />

      <FormField
        htmlFor="uncontrolled-confirm-password"
        label="Confirm password"
        error={errors.confirmPassword}
      >
        <input
          id="uncontrolled-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
      </FormField>

      <FormField
        htmlFor="uncontrolled-country"
        label="Country"
        error={errors.country}
      >
        <input
          id="uncontrolled-country"
          name="country"
          type="text"
          list="uncontrolled-country-list"
          autoComplete="off"
          required
        />

        <datalist id="uncontrolled-country-list">
          {countries.map((country) => (
            <option value={country} key={country} />
          ))}
        </datalist>
      </FormField>

      <button type="submit">Submit</button>
    </form>
  );
}
