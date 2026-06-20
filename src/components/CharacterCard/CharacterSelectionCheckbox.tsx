'use client';

import { useTranslations } from 'next-intl';
import type { JSX } from 'react';

import { useSelectedCharactersStore } from '../../store/selected-characters-store';
import type { Character } from '../../types';

interface CharacterSelectionCheckboxProps {
  character: Character;
}

export default function CharacterSelectionCheckbox({
  character,
}: CharacterSelectionCheckboxProps): JSX.Element {
  const t = useTranslations('CharacterCard');
  const isSelected = useSelectedCharactersStore((state) =>
    state.selectedCharacters.some(
      (selectedCharacter) => selectedCharacter.id === character.id
    )
  );
  const toggleCharacterSelection = useSelectedCharactersStore(
    (state) => state.toggleCharacterSelection
  );

  return (
    <label className="character-list__checkbox-label">
      <input
        className="character-list__checkbox"
        type="checkbox"
        checked={isSelected}
        onChange={() => toggleCharacterSelection(character)}
        aria-label={
          isSelected
            ? t('unselect', { name: character.name })
            : t('select', { name: character.name })
        }
      />
    </label>
  );
}
