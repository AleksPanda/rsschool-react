import { useForm, useWatch } from 'react-hook-form';
import { GENDER_OPTIONS } from '../../constants/form-options';
import type { FormValues } from '../../types/form';
import { getImageDataUrl } from '../../utils/image';
import { FormField } from './FormField';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

type ReactHookFormProps = {
  onSubmit: (values: FormValues) => void;
};

type ReactHookFormFields = Omit<FormValues, 'image'> & {
  image: FileList;
};

export function ReactHookForm({ onSubmit }: ReactHookFormProps) {
  const { control, handleSubmit, register } = useForm<ReactHookFormFields>({
    defaultValues: {
      name: '',
      email: '',
      gender: 'other',
      acceptedTerms: false,
      password: '',
      confirmPassword: '',
    },
  });
  const password = useWatch({ control, name: 'password' }) ?? '';

  async function handleValidSubmit(values: ReactHookFormFields) {
    const { image: imageFiles, ...formValues } = values;

    let image = '';
    try {
      image = await getImageDataUrl(imageFiles?.[0]);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to read image.');
      return;
    }

    onSubmit({
      ...formValues,
      image,
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit(handleValidSubmit)}>
      <FormField htmlFor="hook-form-name" label="Name">
        <input
          id="hook-form-name"
          type="text"
          autoComplete="name"
          required
          data-modal-initial-focus
          {...register('name')}
        />
      </FormField>

      <FormField htmlFor="hook-form-age" label="Age">
        <input
          id="hook-form-age"
          type="number"
          required
          {...register('age', { valueAsNumber: true })}
        />
      </FormField>

      <FormField htmlFor="hook-form-email" label="Email">
        <input
          id="hook-form-email"
          type="email"
          autoComplete="email"
          required
          {...register('email')}
        />
      </FormField>

      <FormField htmlFor="hook-form-gender" label="Gender">
        <select id="hook-form-gender" required {...register('gender')}>
          {GENDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <div className="form__checkbox">
        <input
          id="hook-form-terms"
          type="checkbox"
          required
          {...register('acceptedTerms')}
        />
        <label htmlFor="hook-form-terms">Accept Terms and Conditions</label>
      </div>

      <FormField htmlFor="hook-form-image" label="Profile image">
        <input
          id="hook-form-image"
          type="file"
          accept="image/png,image/jpeg"
          {...register('image')}
        />
      </FormField>

      <FormField htmlFor="hook-form-password" label="Password">
        <input
          id="hook-form-password"
          type="password"
          autoComplete="new-password"
          required
          {...register('password')}
        />
      </FormField>

      <PasswordStrengthIndicator password={password} />

      <FormField htmlFor="hook-form-confirm-password" label="Confirm password">
        <input
          id="hook-form-confirm-password"
          type="password"
          autoComplete="new-password"
          required
          {...register('confirmPassword')}
        />
      </FormField>

      <button type="submit">Submit</button>
    </form>
  );
}
