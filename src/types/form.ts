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
  image: string;
  password: string;
  confirmPassword: string;
  country: string;
  submittedAt: string;
};

export type FormValues = Omit<FormSubmission, 'id' | 'source' | 'submittedAt'>;
