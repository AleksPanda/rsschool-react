import type { FormSubmission } from '../../types/form';

import './SubmissionCard.scss';

type SubmissionCardProps = {
  submission: FormSubmission;
};

const SOURCE_LABELS: Record<FormSubmission['source'], string> = {
  uncontrolled: 'Uncontrolled Form',
  'react-hook-form': 'React Hook Form',
};

export function SubmissionCard({ submission }: SubmissionCardProps) {
  return (
    <article className="submission-card">
      <div className="submission-card__header">
        <h3>{submission.name}</h3>
        <span>{SOURCE_LABELS[submission.source]}</span>
      </div>

      <dl className="submission-card__details">
        <div>
          <dt>Age</dt>
          <dd>{submission.age}</dd>
        </div>

        <div>
          <dt>Email</dt>
          <dd>{submission.email}</dd>
        </div>

        <div>
          <dt>Gender</dt>
          <dd>{submission.gender}</dd>
        </div>

        <div>
          <dt>Terms</dt>
          <dd>{submission.acceptedTerms ? 'Accepted' : 'Not accepted'}</dd>
        </div>
      </dl>
    </article>
  );
}
