import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { useSubmissionsStore } from './store/submissions-store';

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

  it('opens the uncontrolled form in a portal and stores its submission', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
      screen.getByRole('button', { name: 'Open Uncontrolled Form' })
    );

    const dialog = screen.getByRole('dialog', {
      name: 'Uncontrolled Form',
    });

    expect(document.querySelector('#modal-root')).toContainElement(dialog);
    expect(within(dialog).getByLabelText('Name')).toHaveFocus();
    expect(within(dialog).getByLabelText('Age')).toBeInTheDocument();
    expect(within(dialog).getByLabelText('Email')).toBeInTheDocument();
    expect(within(dialog).getByLabelText('Gender')).toBeInTheDocument();
    expect(
      within(dialog).getByLabelText('Accept Terms and Conditions')
    ).toBeInTheDocument();
    expect(within(dialog).getByLabelText('Profile image')).toBeInTheDocument();
    expect(within(dialog).getByLabelText('Password')).toBeInTheDocument();
    expect(
      within(dialog).getByLabelText('Confirm password')
    ).toBeInTheDocument();
    expect(within(dialog).getByLabelText('Country')).toBeInTheDocument();

    await fillForm(dialog, user, {
      name: 'Aleksandra',
      age: '28',
      email: 'aleksandra@example.com',
      gender: 'female',
      image: createImageFile(),
      password: 'Password1!',
      country: 'Israel',
    });
    await user.click(within(dialog).getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByRole('heading', { name: 'Aleksandra' })
    ).toBeVisible();
    expect(screen.getByText('aleksandra@example.com')).toBeVisible();
    expect(screen.getByText('Uncontrolled Form')).toBeVisible();
    expect(screen.getByText('Israel')).toBeVisible();
    expect(screen.getByAltText('Aleksandra profile')).toBeVisible();
    expect(useSubmissionsStore.getState().submissions[0]).toMatchObject({
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
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('stores React Hook Form submissions and keeps history', async () => {
    const user = userEvent.setup();

    render(<App />);

    await submitForm(user, 'Open Uncontrolled Form', {
      name: 'First User',
      age: '30',
      email: 'first@example.com',
      gender: 'male',
      password: 'Firstpass1!',
      country: 'Germany',
    });
    await submitForm(user, 'Open React Hook Form', {
      name: 'Second User',
      age: '31',
      email: 'second@example.com',
      gender: 'other',
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

  it('validates the uncontrolled form only after submit', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
      screen.getByRole('button', { name: 'Open Uncontrolled Form' })
    );

    const dialog = screen.getByRole('dialog', {
      name: 'Uncontrolled Form',
    });

    expect(
      within(dialog).queryByText('Name must start with an uppercase letter.')
    ).not.toBeInTheDocument();

    await user.type(within(dialog).getByLabelText('Name'), 'aleksandra');
    await user.type(within(dialog).getByLabelText('Age'), '-1');
    await user.type(within(dialog).getByLabelText('Email'), 'broken-email');
    await user.type(within(dialog).getByLabelText('Password'), 'Password1!');
    await user.type(
      within(dialog).getByLabelText('Confirm password'),
      'Password2!'
    );
    await user.type(within(dialog).getByLabelText('Country'), 'Atlantis');
    await user.click(
      within(dialog).getByLabelText('Accept Terms and Conditions')
    );
    await user.click(within(dialog).getByRole('button', { name: 'Submit' }));

    expect(
      within(dialog).getByText('Name must start with an uppercase letter.')
    ).toBeVisible();
    expect(within(dialog).getByText('Age must not be negative.')).toBeVisible();
    expect(
      within(dialog).getByText('Email must contain one @ and a dotted domain.')
    ).toBeVisible();
    expect(within(dialog).getByText('Passwords must match.')).toBeVisible();
    expect(
      within(dialog).getByText('Country must be selected from the list.')
    ).toBeVisible();
    expect(useSubmissionsStore.getState().submissions).toHaveLength(0);
  });

  it('disables React Hook Form submit until the form is valid', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
      screen.getByRole('button', { name: 'Open React Hook Form' })
    );

    const dialog = screen.getByRole('dialog', {
      name: 'React Hook Form',
    });
    const submitButton = within(dialog).getByRole('button', {
      name: 'Submit',
    });

    expect(submitButton).toBeDisabled();

    await fillForm(dialog, user, {
      name: 'Valid',
      age: '22',
      email: 'valid@example.com',
      gender: 'other',
      password: 'Password1!',
      country: 'Israel',
    });

    expect(submitButton).toBeEnabled();
  });

  it('closes a modal with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();

    render(<App />);

    const trigger = screen.getByRole('button', {
      name: 'Open React Hook Form',
    });

    await user.click(trigger);

    expect(
      screen.getByRole('dialog', { name: 'React Hook Form' })
    ).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes a modal when the backdrop is clicked', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
      screen.getByRole('button', { name: 'Open Uncontrolled Form' })
    );

    const dialog = screen.getByRole('dialog', {
      name: 'Uncontrolled Form',
    });
    const backdrop = dialog.parentElement;

    expect(backdrop).not.toBeNull();

    fireEvent.mouseDown(backdrop as HTMLElement);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

async function submitForm(
  user: ReturnType<typeof userEvent.setup>,
  triggerName: string,
  values: {
    name: string;
    age: string;
    email: string;
    gender: 'female' | 'male' | 'other';
    image?: File;
    password: string;
    country: string;
  }
) {
  await user.click(screen.getByRole('button', { name: triggerName }));

  const dialog = screen.getByRole('dialog');

  await fillForm(dialog, user, values);
  await user.click(within(dialog).getByRole('button', { name: 'Submit' }));
}

async function fillForm(
  dialog: HTMLElement,
  user: ReturnType<typeof userEvent.setup>,
  values: {
    name: string;
    age: string;
    email: string;
    gender: 'female' | 'male' | 'other';
    image?: File;
    password: string;
    country: string;
  }
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

    expect(imageInput.files?.[0]).toBe(values.image);
  }
  await user.type(within(dialog).getByLabelText('Password'), values.password);
  await user.type(
    within(dialog).getByLabelText('Confirm password'),
    values.password
  );
  await user.type(within(dialog).getByLabelText('Country'), values.country);
  expect(within(dialog).getByText('✓ 1 number')).toBeVisible();
  expect(within(dialog).getByText('✓ 1 uppercase letter')).toBeVisible();
  expect(within(dialog).getByText('✓ 1 lowercase letter')).toBeVisible();
  expect(within(dialog).getByText('✓ 1 special character')).toBeVisible();
  await user.click(
    within(dialog).getByLabelText('Accept Terms and Conditions')
  );
}

function createImageFile() {
  return new File(['avatar'], 'avatar.png', { type: 'image/png' });
}
