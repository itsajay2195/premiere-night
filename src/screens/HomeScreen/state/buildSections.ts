import type { Genre, Movie } from '../../../api/types/movie';
import type { Section } from '../type';

type SectionOrientation = 'horizontal' | 'vertical';

export function buildSections({
  isSearching,
  showGenreResults,
  searchQuery,
  searching,
  searchResults,
  genres,
  selectedGenre,
  genreMovies,
  nowPlaying,
  popular,
  loading,
  isError,
}: {
  isSearching: boolean;
  showGenreResults: boolean;
  searchQuery: string;
  searching: boolean;
  searchResults: Movie[];
  genres: Genre[];
  selectedGenre: number | null;
  genreMovies: Movie[];
  nowPlaying: Movie[];
  popular: Movie[];
  loading: boolean;
  isError: boolean;
}): Section[] {
  if (isSearching) {
    return [
      {
        id: 'search',
        title: searching ? 'Searching...' : `Results for "${searchQuery}"`,
        data: searchResults,
        orientation: 'horizontal',
        size: 'md',
        isLoading: searching,
        emptyMessage: 'No films found.',
      },
    ];
  }

  return [
    ...(showGenreResults
      ? [
          {
            id: 'genre',
            title: genres.find(g => g.id === selectedGenre)?.name ?? '',
            data: genreMovies,
            orientation: 'horizontal' as SectionOrientation,
            size: 'md' as const,
          },
        ]
      : []),
    {
      id: 'nowPlaying',
      title: 'Now Playing',
      data: nowPlaying,
      orientation: 'horizontal',
      size: 'lg',
      isLoading: loading,
      isError,
      emptyMessage: 'Failed to load films.',
    },
    {
      id: 'popular',
      title: 'Popular',
      data: popular,
      orientation: 'horizontal',
      size: 'md',
      isLoading: loading,
      isError,
      emptyMessage: 'Failed to load films.',
    },
  ];
}
