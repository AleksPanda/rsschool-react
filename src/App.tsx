import { useState } from 'react';
import { Modal } from './components/Modal/Modal';
import { SubmissionCard } from './components/SubmissionCard/SubmissionCard';
import { ReactHookForm } from './components/forms/ReactHookForm';
import { UncontrolledForm } from './components/forms/UncontrolledForm';
import { useSubmissionsStore } from './store/submissions-store';
import type { FormSource, FormValues } from './types/form';

import './App.scss';

const FORM_TITLES: Record<FormSource, string> = {
  uncontrolled: 'Uncontrolled Form',
  'react-hook-form': 'React Hook Form',
};

function App() {
  const [activeForm, setActiveForm] = useState<FormSource | null>(null);
  const submissions = useSubmissionsStore((state) => state.submissions);
  const addSubmission = useSubmissionsStore((state) => state.addSubmission);

  function handleSuccessfulSubmit(source: FormSource, values: FormValues) {
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

export default App;
