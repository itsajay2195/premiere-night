import { BASE_URL, IMAGE_BASE } from '../constants/apiConstants';

const API_KEY = '';

export const posterUrl = (
  path: string,
  size: 'w185' | 'w342' | 'w500' | 'original' = 'w342',
) => (path ? `${IMAGE_BASE}/${size}${path}` : null);
export const backdropUrl = (path: string) =>
  path ? `${IMAGE_BASE}/w1280${path}` : null;

async function get<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url: any = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDb error ${res.status}`);
  return res.json();
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MoviesResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export interface GenresResponse {
  genres: Genre[];
}

export const tmdb = {
  nowPlaying: (page = 1) =>
    get<MoviesResponse>('/movie/now_playing', { page: String(page) }),

  popular: (page = 1) =>
    get<MoviesResponse>('/movie/popular', { page: String(page) }),

  topRated: (page = 1) =>
    get<MoviesResponse>('/movie/top_rated', { page: String(page) }),

  search: (query: string, page = 1) =>
    get<MoviesResponse>('/search/movie', { query, page: String(page) }),

  detail: (id: number) => get<Movie>(`/movie/${id}`),

  genres: () => get<GenresResponse>('/genre/movie/list'),

  discover: (genreId: number, page = 1) =>
    get<MoviesResponse>('/discover/movie', {
      with_genres: String(genreId),
      page: String(page),
      sort_by: 'popularity.desc',
    }),
};
