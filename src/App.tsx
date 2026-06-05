import { type FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './components/Modal/Modal';
import { SubmissionCard } from './components/SubmissionCard/SubmissionCard';
import { useSubmissionsStore } from './store/submissions-store';
import type { FormSource, FormSubmission } from './types/form';

import './App.scss';

type SubmissionFormValues = Omit<
  FormSubmission,
  'id' | 'source' | 'submittedAt'
>;

const FORM_TITLES: Record<FormSource, string> = {
  uncontrolled: 'Uncontrolled Form',
  'react-hook-form': 'React Hook Form',
};

function App() {
  const [activeForm, setActiveForm] = useState<FormSource | null>(null);
  const submissions = useSubmissionsStore((state) => state.submissions);
  const addSubmission = useSubmissionsStore((state) => state.addSubmission);

  function handleSuccessfulSubmit(
    source: FormSource,
    values: SubmissionFormValues
  ) {
    addSubmission({
      id: crypto.randomUUID(),
      source,
      submittedAt: new Date().toISOString(),
      ...values,
    });
    setActiveForm(null);
  }

  return (
    <main className="app">
      <section className="app__intro">
        <h1>React Forms</h1>
        <p>
          This application demonstrates form handling with an uncontrolled form
          and React Hook Form.
        </p>

        <div className="app__actions">
          <button type="button" onClick={() => setActiveForm('uncontrolled')}>
            Open Uncontrolled Form
          </button>

          <button
            type="button"
            onClick={() => setActiveForm('react-hook-form')}
          >
            Open React Hook Form
          </button>
        </div>
      </section>

      <section className="app__submissions" aria-labelledby="submissions-title">
        <h2 id="submissions-title">Submitted forms</h2>

        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <div className="app__submissions-list">
            {submissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </div>
        )}
      </section>

      {activeForm && (
        <Modal
          title={FORM_TITLES[activeForm]}
          onClose={() => setActiveForm(null)}
        >
          {activeForm === 'uncontrolled' ? (
            <UncontrolledForm
              onSubmit={(values) =>
                handleSuccessfulSubmit('uncontrolled', values)
              }
            />
          ) : (
            <ReactHookForm
              onSubmit={(values) =>
                handleSuccessfulSubmit('react-hook-form', values)
              }
            />
          )}
        </Modal>
      )}
    </main>
  );
}

type FormProps = {
  onSubmit: (values: SubmissionFormValues) => void;
};

function UncontrolledForm({ onSubmit }: FormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSubmit({
      name: String(formData.get('name') ?? ''),
      age: Number(formData.get('age') ?? 0),
      email: String(formData.get('email') ?? ''),
      gender: String(
        formData.get('gender') ?? 'other'
      ) as FormSubmission['gender'],
      acceptedTerms: formData.get('acceptedTerms') === 'on',
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__field">
        <label htmlFor="uncontrolled-name">Name</label>
        <input
          id="uncontrolled-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          data-modal-initial-focus
        />
      </div>

      <div className="form__field">
        <label htmlFor="uncontrolled-age">Age</label>
        <input id="uncontrolled-age" name="age" type="number" required />
      </div>

      <div className="form__field">
        <label htmlFor="uncontrolled-email">Email</label>
        <input
          id="uncontrolled-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="form__field">
        <label htmlFor="uncontrolled-gender">Gender</label>
        <select id="uncontrolled-gender" name="gender" required>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form__checkbox">
        <input
          id="uncontrolled-terms"
          name="acceptedTerms"
          type="checkbox"
          required
        />
        <label htmlFor="uncontrolled-terms">Accept Terms and Conditions</label>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

function ReactHookForm({ onSubmit }: FormProps) {
  const { handleSubmit, register } = useForm<SubmissionFormValues>({
    defaultValues: {
      name: '',
      email: '',
      gender: 'other',
      acceptedTerms: false,
    },
  });

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form__field">
        <label htmlFor="hook-form-name">Name</label>
        <input
          id="hook-form-name"
          type="text"
          autoComplete="name"
          required
          data-modal-initial-focus
          {...register('name')}
        />
      </div>

      <div className="form__field">
        <label htmlFor="hook-form-age">Age</label>
        <input
          id="hook-form-age"
          type="number"
          required
          {...register('age', { valueAsNumber: true })}
        />
      </div>

      <div className="form__field">
        <label htmlFor="hook-form-email">Email</label>
        <input
          id="hook-form-email"
          type="email"
          autoComplete="email"
          required
          {...register('email')}
        />
      </div>

      <div className="form__field">
        <label htmlFor="hook-form-gender">Gender</label>
        <select id="hook-form-gender" required {...register('gender')}>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form__checkbox">
        <input
          id="hook-form-terms"
          type="checkbox"
          required
          {...register('acceptedTerms')}
        />
        <label htmlFor="hook-form-terms">Accept Terms and Conditions</label>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default App;
