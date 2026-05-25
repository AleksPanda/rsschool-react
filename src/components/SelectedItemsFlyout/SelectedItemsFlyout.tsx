import type { JSX } from 'react';

import './SelectedItemsFlyout.scss';

interface SelectedItemsFlyoutProps {
  selectedCount: number;
  onUnselectAll: () => void;
  onDownload: () => void;
}

function SelectedItemsFlyout({
  selectedCount,
  onUnselectAll,
  onDownload,
}: SelectedItemsFlyoutProps): JSX.Element | null {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <aside
      className="selected-items-flyout"
      aria-label="Selected items actions"
    >
      <p className="selected-items-flyout__summary">
        Selected items: <strong>{selectedCount}</strong>
      </p>

      <div className="selected-items-flyout__actions">
        <button
          className="selected-items-flyout__button selected-items-flyout__button--secondary"
          type="button"
          onClick={onUnselectAll}
        >
          Unselect all
        </button>

        <button
          className="selected-items-flyout__button"
          type="button"
          onClick={onDownload}
        >
          Download
        </button>
      </div>
    </aside>
  );
}

export default SelectedItemsFlyout;
