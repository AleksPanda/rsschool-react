export const characterQueryKeys = {
  all: ['characters'] as const,

  lists: () => [...characterQueryKeys.all, 'list'] as const,

  list: (searchTerm: string, page: number) =>
    [...characterQueryKeys.lists(), { searchTerm, page }] as const,

  details: () => [...characterQueryKeys.all, 'details'] as const,

  detail: (characterId: string) =>
    [...characterQueryKeys.details(), characterId] as const,
};
