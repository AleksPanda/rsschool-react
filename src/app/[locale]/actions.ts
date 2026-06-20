'use server';

import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';

export async function searchCharacters(formData: FormData): Promise<void> {
  const searchValue = formData.get('search');
  const searchTerm = typeof searchValue === 'string' ? searchValue.trim() : '';
  const locale = await getLocale();
  const params = new URLSearchParams({ page: '1' });

  if (searchTerm) {
    params.set('search', searchTerm);
  }

  redirect({ href: `/?${params.toString()}`, locale });
}
