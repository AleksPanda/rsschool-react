import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useState } from 'react';
import { Modal } from './Modal';

describe('Modal', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="modal-root"></div>';
  });

  afterEach(() => {
    cleanup();
    document.body.replaceChildren();
  });

  it('renders content in a portal and focuses the initial control', () => {
    render(
      <Modal title="Test modal" onClose={() => {}}>
        <button type="button" data-modal-initial-focus>
          Primary action
        </button>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { name: 'Test modal' });

    expect(document.querySelector('#modal-root')).toContainElement(dialog);
    expect(within(dialog).getByText('Primary action')).toHaveFocus();
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();

    render(<ModalHarness />);

    const trigger = screen.getByRole('button', { name: 'Open modal' });

    await user.click(trigger);

    expect(screen.getByRole('dialog', { name: 'Test modal' })).toBeVisible();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes when the backdrop is clicked', async () => {
    const user = userEvent.setup();

    render(<ModalHarness />);

    await user.click(screen.getByRole('button', { name: 'Open modal' }));

    const dialog = screen.getByRole('dialog', { name: 'Test modal' });
    const backdrop = dialog.parentElement;

    expect(backdrop).not.toBeNull();

    fireEvent.mouseDown(backdrop as HTMLElement);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

function ModalHarness() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open modal
      </button>

      {isOpen && (
        <Modal title="Test modal" onClose={() => setIsOpen(false)}>
          <input aria-label="Modal field" data-modal-initial-focus />
        </Modal>
      )}
    </>
  );
}
