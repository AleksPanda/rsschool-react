'use client';

import type { JSX } from 'react';
import { useTransition } from 'react';

import { useRouter } from '../../i18n/navigation';

interface RefreshButtonProps {
  label: string;
  pendingLabel: string;
  className?: string;
}

export default function RefreshButton({
  label,
  pendingLabel,
  className = '',
}: RefreshButtonProps): JSX.Element {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = (): void => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      className={`pagination__button ${className}`.trim()}
      type="button"
      onClick={handleRefresh}
      disabled={isPending}
    >
      {isPending ? pendingLabel : label}
    </button>
  );
}
