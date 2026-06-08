import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createImageFile, fillForm } from '../../test/form-test-utils';
import { ReactHookForm } from './ReactHookForm';

describe('ReactHookForm', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders labeled fields', () => {
    render(<ReactHookForm onSubmit={() => {}} />);

    const form = screen.getByRole('form', { name: 'React Hook Form' });
    const labels = [
      'Name',
      'Age',
      'Email',
      'Gender',
      'Profile image',
      'Password',
      'Confirm password',
      'Country',
      'Accept Terms and Conditions',
    ];

    labels.forEach((label) => {
      expect(within(form).getByLabelText(label)).toBeInTheDocument();
    });
    expect(within(form).getByLabelText('Profile image')).toBeRequired();
  });

  it('disables submit until the form is valid', async () => {
    const user = userEvent.setup();

    render(<ReactHookForm onSubmit={() => {}} />);

    const form = screen.getByRole('form', { name: 'React Hook Form' });
    const submitButton = within(form).getByRole('button', { name: 'Submit' });

    expect(submitButton).toBeDisabled();

    await fillForm(form, user, {
      name: 'Valid',
      age: '22',
      email: 'valid@example.com',
      gender: 'other',
      image: createImageFile('valid-user.png'),
      password: 'Password1!',
      country: 'Israel',
    });

    expect(submitButton).toBeEnabled();
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<ReactHookForm onSubmit={handleSubmit} />);

    const form = screen.getByRole('form', { name: 'React Hook Form' });

    await fillForm(form, user, {
      name: 'Hookuser',
      age: '31',
      email: 'hook@example.com',
      gender: 'male',
      image: createImageFile('hook-user.png'),
      password: 'Password1!',
      country: 'France',
    });
    await user.click(within(form).getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'Hookuser',
        age: 31,
        email: 'hook@example.com',
        gender: 'male',
        acceptedTerms: true,
        image: 'data:image/png;base64,YXZhdGFy',
        password: 'Password1!',
        confirmPassword: 'Password1!',
        country: 'France',
      });
    });
  });
});
