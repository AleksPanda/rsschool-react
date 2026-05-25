import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SelectedItemsFlyout from './SelectedItemsFlyout';
import { describe, expect, it, vi } from 'vitest';

describe('SelectedItemsFlyout', () => {
  it('does not render when selected count is zero', () => {
    render(
      <SelectedItemsFlyout
        selectedCount={0}
        onUnselectAll={vi.fn()}
        onDownload={vi.fn()}
      />
    );

    expect(
      screen.queryByLabelText(/selected items actions/i)
    ).not.toBeInTheDocument();
  });

  it('renders selected items count and action buttons', () => {
    render(
      <SelectedItemsFlyout
        selectedCount={3}
        onUnselectAll={vi.fn()}
        onDownload={vi.fn()}
      />
    );

    expect(
      screen.getByLabelText(/selected items actions/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/selected items:/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /unselect all/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /download/i })
    ).toBeInTheDocument();
  });

  it('calls onUnselectAll when Unselect all button is clicked', async () => {
    const user = userEvent.setup();
    const onUnselectAll = vi.fn();

    render(
      <SelectedItemsFlyout
        selectedCount={2}
        onUnselectAll={onUnselectAll}
        onDownload={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /unselect all/i }));

    expect(onUnselectAll).toHaveBeenCalledTimes(1);
  });

  it('calls onDownload when Download button is clicked', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    render(
      <SelectedItemsFlyout
        selectedCount={2}
        onUnselectAll={vi.fn()}
        onDownload={onDownload}
      />
    );

    await user.click(screen.getByRole('button', { name: /download/i }));

    expect(onDownload).toHaveBeenCalledTimes(1);
  });
});
