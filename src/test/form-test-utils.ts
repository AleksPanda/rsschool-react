import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';

type FormValues = {
  name: string;
  age: string;
  email: string;
  gender: 'female' | 'male' | 'other';
  image?: File;
  password: string;
  country: string;
};

export async function fillForm(
  dialog: HTMLElement,
  user: ReturnType<typeof userEvent.setup>,
  values: FormValues
) {
  await user.type(within(dialog).getByLabelText('Name'), values.name);
  await user.type(within(dialog).getByLabelText('Age'), values.age);
  await user.type(within(dialog).getByLabelText('Email'), values.email);
  await user.selectOptions(
    within(dialog).getByLabelText('Gender'),
    values.gender
  );

  if (values.image) {
    const imageInput = within(dialog).getByLabelText(
      'Profile image'
    ) as HTMLInputElement;

    await user.upload(imageInput, values.image);
  }

  await user.type(within(dialog).getByLabelText('Password'), values.password);
  await user.type(
    within(dialog).getByLabelText('Confirm password'),
    values.password
  );
  await user.type(within(dialog).getByLabelText('Country'), values.country);

  await user.click(
    within(dialog).getByLabelText('Accept Terms and Conditions')
  );
}

export async function submitForm(
  user: ReturnType<typeof userEvent.setup>,
  triggerName: string,
  values: FormValues
) {
  await user.click(screen.getByRole('button', { name: triggerName }));

  const dialog = screen.getByRole('dialog');

  await fillForm(dialog, user, values);
  await user.click(within(dialog).getByRole('button', { name: 'Submit' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
}

export function createImageFile(name = 'avatar.png') {
  return new File(['avatar'], name, { type: 'image/png' });
}
