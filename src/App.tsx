import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Modal } from './components/Modal/Modal';

import './App.scss';

type FormType = 'uncontrolled' | 'react-hook-form';
type HookFormValues = {
  name: string;
};

const FORM_TITLES: Record<FormType, string> = {
  uncontrolled: 'Uncontrolled Form',
  'react-hook-form': 'React Hook Form',
};

function App() {
  const [activeForm, setActiveForm] = useState<FormType | null>(null);

  function closeModal() {
    setActiveForm(null);
  }

  return (
    <main className="app">
      <section className="app__intro">
        <h1>React Forms</h1>
        <p>
          Open either form in the same accessible modal without leaving the main
          page.
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

      {activeForm ? (
        <Modal title={FORM_TITLES[activeForm]} onClose={closeModal}>
          {activeForm === 'uncontrolled' ? (
            <UncontrolledForm />
          ) : (
            <ReactHookForm />
          )}
        </Modal>
      ) : null}
    </main>
  );
}

function UncontrolledForm() {
  return (
    <form className="form" onSubmit={(event) => event.preventDefault()}>
      <label className="form__field">
        Name
        <input
          name="name"
          type="text"
          autoComplete="name"
          data-modal-initial-focus
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}

function ReactHookForm() {
  const { register, handleSubmit } = useForm<HookFormValues>({
    defaultValues: {
      name: '',
    },
  });

  return (
    <form className="form" onSubmit={handleSubmit(() => undefined)}>
      <label className="form__field">
        Name
        <input
          type="text"
          autoComplete="name"
          data-modal-initial-focus
          {...register('name')}
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}

export default App;
