import { beforeEach, describe, expect, it } from 'vitest';
import { useSubmissionsStore } from './submissions-store';
import type { FormSubmission } from '../types/form';

describe('useSubmissionsStore', () => {
  beforeEach(() => {
    useSubmissionsStore.setState({
      submissions: [],
    });
  });

  it('adds new submissions to the beginning of the history', () => {
    const firstSubmission = createSubmission('first');
    const secondSubmission = createSubmission('second');

    useSubmissionsStore.getState().addSubmission(firstSubmission);
    useSubmissionsStore.getState().addSubmission(secondSubmission);

    expect(useSubmissionsStore.getState().submissions).toEqual([
      secondSubmission,
      firstSubmission,
    ]);
  });
});

function createSubmission(id: string): FormSubmission {
  return {
    id,
    source: 'uncontrolled',
    name: 'Aleksandra',
    age: 28,
    email: 'aleksandra@example.com',
    gender: 'female',
    acceptedTerms: true,
    image: 'data:image/png;base64,YXZhdGFy',
    password: 'Password1!',
    confirmPassword: 'Password1!',
    country: 'Israel',
    submittedAt: '2026-06-08T00:00:00.000Z',
  };
}
