import { IMAGE_BASE } from '../constants/api';

type PosterSize = 'w185' | 'w342' | 'w500' | 'original';

export const getPosterUrl = (path: string | null, size: PosterSize = 'w342') =>
  path ? `${IMAGE_BASE}/${size}${path}` : null;

export const getBackdropUrl = (path: string | null) =>
  path ? `${IMAGE_BASE}/w1280${path}` : null;
