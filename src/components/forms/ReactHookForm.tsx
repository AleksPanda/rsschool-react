import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { GENDER_OPTIONS } from '../../constants/form-options';
import { useCountriesStore } from '../../store/countries-store';
import type { FormValues } from '../../types/form';
import { getImageDataUrl } from '../../utils/image';
import { createReactHookFormSchema } from '../../validation/form-validation';
import { FormField } from './FormField';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

type ReactHookFormProps = {
  onSubmit: (values: FormValues) => void;
};

type ReactHookFormFields = Omit<FormValues, 'image'> & {
  image: FileList | undefined;
};

export function ReactHookForm({ onSubmit }: ReactHookFormProps) {
  const countries = useCountriesStore((state) => state.countries);
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm<ReactHookFormFields>({
    defaultValues: {
      name: '',
      email: '',
      gender: 'other',
      acceptedTerms: false,
      password: '',
      confirmPassword: '',
      country: '',
    },
    mode: 'onChange',
    resolver: zodResolver(createReactHookFormSchema(countries)),
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
    <form
      className="form"
      onSubmit={handleSubmit(handleValidSubmit)}
      noValidate
    >
      <FormField
        htmlFor="hook-form-name"
        label="Name"
        error={errors.name?.message}
      >
        <input
          id="hook-form-name"
          type="text"
          autoComplete="name"
          required
          data-modal-initial-focus
          {...register('name')}
        />
      </FormField>

      <FormField
        htmlFor="hook-form-age"
        label="Age"
        error={errors.age?.message}
      >
        <input
          id="hook-form-age"
          type="number"
          required
          {...register('age', { valueAsNumber: true })}
        />
      </FormField>

      <FormField
        htmlFor="hook-form-email"
        label="Email"
        error={errors.email?.message}
      >
        <input
          id="hook-form-email"
          type="email"
          autoComplete="email"
          required
          {...register('email')}
        />
      </FormField>

      <FormField
        htmlFor="hook-form-gender"
        label="Gender"
        error={errors.gender?.message}
      >
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
      <p className="form__error">{errors.acceptedTerms?.message}</p>

      <FormField
        htmlFor="hook-form-image"
        label="Profile image"
        error={errors.image?.message}
      >
        <input
          id="hook-form-image"
          type="file"
          accept="image/png,image/jpeg"
          {...register('image')}
        />
      </FormField>

      <FormField
        htmlFor="hook-form-password"
        label="Password"
        error={errors.password?.message}
      >
        <input
          id="hook-form-password"
          type="password"
          autoComplete="new-password"
          required
          {...register('password')}
        />
      </FormField>

      <PasswordStrengthIndicator password={password} />

      <FormField
        htmlFor="hook-form-confirm-password"
        label="Confirm password"
        error={errors.confirmPassword?.message}
      >
        <input
          id="hook-form-confirm-password"
          type="password"
          autoComplete="new-password"
          required
          {...register('confirmPassword')}
        />
      </FormField>

      <FormField
        htmlFor="hook-form-country"
        label="Country"
        error={errors.country?.message}
      >
        <input
          id="hook-form-country"
          type="text"
          list="hook-form-country-list"
          autoComplete="off"
          required
          {...register('country')}
        />

        <datalist id="hook-form-country-list">
          {countries.map((country) => (
            <option value={country} key={country} />
          ))}
        </datalist>
      </FormField>

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}
