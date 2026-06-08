type PasswordStrengthIndicatorProps = {
  password: string;
};

const PASSWORD_REQUIREMENTS = [
  {
    label: '1 number',
    isValid: (password: string) => /\d/.test(password),
  },
  {
    label: '1 uppercase letter',
    isValid: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: '1 lowercase letter',
    isValid: (password: string) => /[a-z]/.test(password),
  },
  {
    label: '1 special character',
    isValid: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
];

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  return (
    <ul className="password-strength" aria-label="Password requirements">
      {PASSWORD_REQUIREMENTS.map((requirement) => {
        const isValid = requirement.isValid(password);
        const className = isValid
          ? 'password-strength__item password-strength__item--valid'
          : 'password-strength__item';
        const marker = isValid ? '✓' : '○';

        return (
          <li className={className} key={requirement.label}>
            {marker} {requirement.label}
          </li>
        );
      })}
    </ul>
  );
}
