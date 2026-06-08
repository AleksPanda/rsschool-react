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
import { UncontrolledForm } from './UncontrolledForm';

describe('UncontrolledForm', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders labeled fields', () => {
    render(<UncontrolledForm onSubmit={() => {}} />);

    const form = screen.getByRole('form', { name: 'Uncontrolled form' });
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

  it('submits valid data', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<UncontrolledForm onSubmit={handleSubmit} />);

    const form = screen.getByRole('form', { name: 'Uncontrolled form' });

    await fillForm(form, user, {
      name: 'Aleksandra',
      age: '28',
      email: 'aleksandra@example.com',
      gender: 'female',
      image: createImageFile(),
      password: 'Password1!',
      country: 'Israel',
    });
    await user.click(within(form).getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'Aleksandra',
        age: 28,
        email: 'aleksandra@example.com',
        gender: 'female',
        acceptedTerms: true,
        image: 'data:image/png;base64,YXZhdGFy',
        password: 'Password1!',
        confirmPassword: 'Password1!',
        country: 'Israel',
      });
    });
  });

  it('validates only after submit and requires the image upload', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<UncontrolledForm onSubmit={handleSubmit} />);

    const form = screen.getByRole('form', { name: 'Uncontrolled form' });

    expect(
      within(form).queryByText('Name must start with an uppercase letter.')
    ).not.toBeInTheDocument();

    await user.type(within(form).getByLabelText('Name'), 'aleksandra');
    await user.type(within(form).getByLabelText('Age'), '-1');
    await user.type(within(form).getByLabelText('Email'), 'broken-email');
    await user.type(within(form).getByLabelText('Password'), 'Password1!');
    await user.type(
      within(form).getByLabelText('Confirm password'),
      'Password2!'
    );
    await user.type(within(form).getByLabelText('Country'), 'Atlantis');
    await user.click(
      within(form).getByLabelText('Accept Terms and Conditions')
    );
    await user.click(within(form).getByRole('button', { name: 'Submit' }));

    expect(
      within(form).getByText('Name must start with an uppercase letter.')
    ).toBeVisible();
    expect(within(form).getByText('Age must not be negative.')).toBeVisible();
    expect(
      within(form).getByText('Email must contain one @ and a dotted domain.')
    ).toBeVisible();
    expect(within(form).getByText('Profile image is required.')).toBeVisible();
    expect(within(form).getByText('Passwords must match.')).toBeVisible();
    expect(
      within(form).getByText('Country must be selected from the list.')
    ).toBeVisible();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
