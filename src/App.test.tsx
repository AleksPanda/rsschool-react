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

    await fillForm(dialog, user, {
      name: 'Aleksandra',
      age: '28',
      email: 'aleksandra@example.com',
      gender: 'female',
    });
    await user.click(within(dialog).getByRole('button', { name: 'Submit' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Aleksandra' })).toBeVisible();
    expect(screen.getByText('aleksandra@example.com')).toBeVisible();
    expect(screen.getByText('Uncontrolled Form')).toBeVisible();
    expect(useSubmissionsStore.getState().submissions[0]).toMatchObject({
      name: 'Aleksandra',
      age: 28,
      email: 'aleksandra@example.com',
      gender: 'female',
      acceptedTerms: true,
    });
  });

  it('stores React Hook Form submissions and keeps history', async () => {
    const user = userEvent.setup();

    render(<App />);

    await submitForm(user, 'Open Uncontrolled Form', {
      name: 'First User',
      age: '30',
      email: 'first@example.com',
      gender: 'male',
    });
    await submitForm(user, 'Open React Hook Form', {
      name: 'Second User',
      age: '31',
      email: 'second@example.com',
      gender: 'other',
    });

    expect(screen.getByRole('heading', { name: 'First User' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Second User' })).toBeVisible();
    expect(screen.getByText('first@example.com')).toBeVisible();
    expect(screen.getByText('second@example.com')).toBeVisible();
    expect(screen.getByText('Uncontrolled Form')).toBeVisible();
    expect(screen.getByText('React Hook Form')).toBeVisible();
    expect(useSubmissionsStore.getState().submissions).toHaveLength(2);
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
  }
) {
  await user.type(within(dialog).getByLabelText('Name'), values.name);
  await user.type(within(dialog).getByLabelText('Age'), values.age);
  await user.type(within(dialog).getByLabelText('Email'), values.email);
  await user.selectOptions(
    within(dialog).getByLabelText('Gender'),
    values.gender
  );
  await user.click(
    within(dialog).getByLabelText('Accept Terms and Conditions')
  );
}
