import type { JSX } from 'react';

interface CharacterListProps {
  placeholder: string;
}

function CharacterList({ placeholder }: CharacterListProps): JSX.Element {
  return (
    <div className="results-placeholder">
      <p>{placeholder}</p>
    </div>
  );
}

export default CharacterList;
