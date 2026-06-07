import type { ReactNode } from 'react';

type FormFieldProps = {
  htmlFor: string;
  label: string;
  children: ReactNode;
};

export function FormField({ htmlFor, label, children }: FormFieldProps) {
  return (
    <div className="form__field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}
