import type { SubmitEventHandler } from 'react';
import { GENDER_OPTIONS } from '../../constants/form-options';
import type { FormSubmission, FormValues } from '../../types/form';
import { getImageDataUrl } from '../../utils/image';
import { FormField } from './FormField';

type UncontrolledFormProps = {
  onSubmit: (values: FormValues) => void;
};

export function UncontrolledForm({ onSubmit }: UncontrolledFormProps) {
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const imageInput = event.currentTarget.elements.namedItem(
      'image'
    ) as HTMLInputElement | null;

    let image = '';
    try {
      image = await getImageDataUrl(imageInput?.files?.[0]);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to read image.');
      return;
    }

    onSubmit({
      name: String(formData.get('name') ?? ''),
      age: Number(formData.get('age') ?? 0),
      email: String(formData.get('email') ?? ''),
      gender: String(
        formData.get('gender') ?? 'other'
      ) as FormSubmission['gender'],
      acceptedTerms: formData.get('acceptedTerms') === 'on',
      image,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <FormField htmlFor="uncontrolled-name" label="Name">
        <input
          id="uncontrolled-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          data-modal-initial-focus
        />
      </FormField>

      <FormField htmlFor="uncontrolled-age" label="Age">
        <input id="uncontrolled-age" name="age" type="number" required />
      </FormField>

      <FormField htmlFor="uncontrolled-email" label="Email">
        <input
          id="uncontrolled-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </FormField>

      <FormField htmlFor="uncontrolled-gender" label="Gender">
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

      <FormField htmlFor="uncontrolled-image" label="Profile image">
        <input
          id="uncontrolled-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg"
        />
      </FormField>

      <button type="submit">Submit</button>
    </form>
  );
}
