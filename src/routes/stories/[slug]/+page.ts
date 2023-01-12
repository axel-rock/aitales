import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
  return {
    stories: [
      {
        id: 'ks1',
        title: 'Un drôle d\'anniversaire',
        description: 'Kids Story 1 Description',
        content: 'Once upon a time...',
        category: 'Kids story'
      },
      {
        id: 'ks2',
        title: 'La disparition du père Noël',
        description: 'Kids Story 2 Description',
        content: 'Once upon a time...',
        category: 'Kids story'
      }
    ]
  }.stories.find((story) => story.id === params.slug);
}) satisfies PageLoad;