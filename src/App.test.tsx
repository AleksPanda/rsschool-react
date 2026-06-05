import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('App modal forms', () => {
  beforeEach(() => {
    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.append(modalRoot);
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it('opens the uncontrolled form in a portal modal', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
      screen.getByRole('button', { name: 'Open Uncontrolled Form' })
    );

    const modalRoot = document.querySelector('#modal-root');
    const dialog = screen.getByRole('dialog', { name: 'Uncontrolled Form' });

    expect(modalRoot).toContainElement(dialog);
    expect(within(dialog).getByLabelText('Name')).toHaveFocus();
  });

  it('uses the same modal component for the React Hook Form implementation', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
      screen.getByRole('button', { name: 'Open React Hook Form' })
    );

    const dialog = screen.getByRole('dialog', { name: 'React Hook Form' });

    expect(within(dialog).getByLabelText('Name')).toBeInTheDocument();
    expect(
      within(dialog).getByRole('button', { name: 'Submit' })
    ).toBeVisible();
  });

  it('closes with Escape and returns focus to the opener', async () => {
    const user = userEvent.setup();

    render(<App />);

    const opener = screen.getByRole('button', {
      name: 'Open Uncontrolled Form',
    });

    await user.click(opener);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it('closes when clicking outside the modal', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
      screen.getByRole('button', { name: 'Open Uncontrolled Form' })
    );
    await user.click(screen.getByRole('dialog').parentElement!);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
