'use client';

import { useState, type JSX } from 'react';

interface TestErrorButtonProps {
  label: string;
}

export default function TestErrorButton({
  label,
}: TestErrorButtonProps): JSX.Element {
  const [hasTestError, setHasTestError] = useState(false);

  if (hasTestError) {
    throw new Error('Test error boundary error');
  }

  return (
    <button
      className="app-button"
      type="button"
      onClick={() => setHasTestError(true)}
    >
      {label}
    </button>
  );
}
