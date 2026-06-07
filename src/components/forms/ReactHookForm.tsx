import { useForm } from 'react-hook-form';
import { GENDER_OPTIONS } from '../../constants/form-options';
import type { FormValues } from '../../types/form';
import { FormField } from './FormField';

type ReactHookFormProps = {
  onSubmit: (values: FormValues) => void;
};

export function ReactHookForm({ onSubmit }: ReactHookFormProps) {
  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      gender: 'other',
      acceptedTerms: false,
    },
  });

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
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

      <button type="submit">Submit</button>
    </form>
  );
}
