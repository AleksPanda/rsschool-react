import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { useSubmissionsStore } from './store/submissions-store';
import { createImageFile, submitForm } from './test/form-test-utils';

describe('App submissions', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="modal-root"></div>';
    useSubmissionsStore.setState({
      submissions: [],
    });
  });

  afterEach(() => {
    cleanup();
    document.body.replaceChildren();
  });

  it('renders an empty submissions state', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Submitted forms' })
    ).toBeInTheDocument();
    expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
  });

  it('stores submissions from both forms and keeps history', async () => {
    const user = userEvent.setup();

    render(<App />);

    await submitForm(user, 'Open Uncontrolled Form', {
      name: 'First User',
      age: '30',
      email: 'first@example.com',
      gender: 'male',
      image: createImageFile('first-user.png'),
      password: 'Firstpass1!',
      country: 'Germany',
    });
    await submitForm(user, 'Open React Hook Form', {
      name: 'Second User',
      age: '31',
      email: 'second@example.com',
      gender: 'other',
      image: createImageFile('second-user.png'),
      password: 'Secondpass1!',
      country: 'France',
    });

    expect(screen.getByRole('heading', { name: 'First User' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Second User' })).toBeVisible();
    expect(screen.getByText('first@example.com')).toBeVisible();
    expect(screen.getByText('second@example.com')).toBeVisible();
    expect(screen.getByText('Germany')).toBeVisible();
    expect(screen.getByText('France')).toBeVisible();
    expect(screen.getByText('Uncontrolled Form')).toBeVisible();
    expect(screen.getByText('React Hook Form')).toBeVisible();
    expect(useSubmissionsStore.getState().submissions).toHaveLength(2);
  });

  it('closes the modal, resets the form, and highlights a new submission', async () => {
    const user = userEvent.setup();

    render(<App />);

    await submitForm(user, 'Open Uncontrolled Form', {
      name: 'Reset User',
      age: '26',
      email: 'reset@example.com',
      gender: 'female',
      image: createImageFile('reset-user.png'),
      password: 'Password1!',
      country: 'Israel',
    });

    const card = screen
      .getByRole('heading', { name: 'Reset User' })
      .closest('article');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(card).toHaveClass('submission-card--highlighted');

    await user.click(
      screen.getByRole('button', { name: 'Open Uncontrolled Form' })
    );

    const dialog = screen.getByRole('dialog', { name: 'Uncontrolled Form' });

    expect(within(dialog).getByLabelText('Name')).toHaveValue('');
  });
});
