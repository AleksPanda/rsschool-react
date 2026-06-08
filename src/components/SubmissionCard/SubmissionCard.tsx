import type { FormSubmission } from '../../types/form';

import './SubmissionCard.scss';

type SubmissionCardProps = {
  submission: FormSubmission;
  isHighlighted?: boolean;
};

const SOURCE_LABELS: Record<FormSubmission['source'], string> = {
  uncontrolled: 'Uncontrolled Form',
  'react-hook-form': 'React Hook Form',
};

export function SubmissionCard({
  submission,
  isHighlighted = false,
}: SubmissionCardProps) {
  const cardClassName = isHighlighted
    ? 'submission-card submission-card--highlighted'
    : 'submission-card';

  return (
    <article className={cardClassName}>
      <div className="submission-card__header">
        <h3>{submission.name}</h3>
        <span>{SOURCE_LABELS[submission.source]}</span>
      </div>

      {submission.image && (
        <img
          className="submission-card__image"
          src={submission.image}
          alt={`${submission.name} profile`}
        />
      )}

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

        <div>
          <dt>Country</dt>
          <dd>{submission.country}</dd>
        </div>
      </dl>
    </article>
  );
}
