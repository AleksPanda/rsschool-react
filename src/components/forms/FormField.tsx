import type { ReactNode } from 'react';

type FormFieldProps = {
  htmlFor: string;
  label: string;
  children: ReactNode;
  error?: string;
};

export function FormField({ htmlFor, label, children, error }: FormFieldProps) {
  return (
    <div className="form__field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      <p className="form__error">{error}</p>
    </div>
  );
}
