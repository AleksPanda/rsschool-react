export type FormSource = 'uncontrolled' | 'react-hook-form';
export type Gender = 'female' | 'male' | 'other';

export type FormSubmission = {
  id: string;
  source: FormSource;
  name: string;
  age: number;
  email: string;
  gender: Gender;
  acceptedTerms: boolean;
  submittedAt: string;
};
