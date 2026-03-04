import { BASE_URL } from '../constants/apiConstants';

const API_KEY = '';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function get<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url: any = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new ApiError(res.status, `TMDb error ${res.status}: ${endpoint}`);
  }

  return res.json() as Promise<T>;
}
