import { http, HttpResponse } from 'msw';

import { mockPlace, mockPlace2, mockPlaces, TEST_USER_ID } from '../../test/fixtures/places';
import { mockSession } from '../../test/fixtures/session';

const SUPABASE_URL = 'https://test.supabase.co';

let places = [...mockPlaces];
let nextId = 3;

export function resetSupabaseStore() {
  places = [...mockPlaces];
  nextId = 3;
}

export const supabaseHandlers = [
  http.get(`${SUPABASE_URL}/rest/v1/places`, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id')?.replace('eq.', '');
    const idFilter = url.searchParams.get('id')?.replace('eq.', '');
    const titleFilter = url.searchParams.get('title');

    if (idFilter) {
      const place = places.find((p) => p.id === Number(idFilter));
      if (!place) {
        return HttpResponse.json(
          { message: 'Row not found', code: 'PGRST116' },
          { status: 406 }
        );
      }
      return HttpResponse.json(place);
    }

    let filtered = places.filter((p) => p.user_id === userId);

    if (titleFilter?.startsWith('ilike.')) {
      const pattern = titleFilter.replace('ilike.', '').replace(/%/g, '');
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(pattern.toLowerCase())
      );
    }

    filtered.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const offset = Number(url.searchParams.get('offset') ?? 0);
    const limitParam = url.searchParams.get('limit');

    if (limitParam) {
      const limit = Number(limitParam);
      const paged = filtered.slice(offset, offset + limit);
      return HttpResponse.json(paged);
    }

    const range = request.headers.get('Range');
    if (range) {
      const [start, end] = range.split('-').map(Number);
      const paged = filtered.slice(start, end + 1);
      return HttpResponse.json(paged, {
        headers: { 'Content-Range': `${start}-${start + paged.length - 1}/${filtered.length}` },
      });
    }

    return HttpResponse.json(filtered);
  }),

  http.post(`${SUPABASE_URL}/rest/v1/places`, async ({ request }) => {
    const body = (await request.json()) as (typeof places)[0];
    const newPlace = {
      ...body,
      id: nextId++,
      created_at: new Date().toISOString(),
    };
    places.push(newPlace);
    return HttpResponse.json(newPlace);
  }),

  http.patch(`${SUPABASE_URL}/rest/v1/places`, async ({ request }) => {
    const url = new URL(request.url);
    const id = Number(url.searchParams.get('id')?.replace('eq.', ''));
    const body = (await request.json()) as Partial<(typeof places)[0]>;
    const index = places.findIndex((p) => p.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    }

    places[index] = { ...places[index], ...body };
    return HttpResponse.json(places[index]);
  }),

  http.delete(`${SUPABASE_URL}/rest/v1/places`, ({ request }) => {
    const url = new URL(request.url);
    const id = Number(url.searchParams.get('id')?.replace('eq.', ''));
    places = places.filter((p) => p.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${SUPABASE_URL}/auth/v1/token`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (body.email === 'bad@example.com') {
      return HttpResponse.json({ error: 'invalid_credentials', error_description: 'Invalid login credentials' }, { status: 400 });
    }

    return HttpResponse.json({
      access_token: mockSession.access_token,
      refresh_token: mockSession.refresh_token,
      expires_in: mockSession.expires_in,
      token_type: mockSession.token_type,
      user: mockSession.user,
    });
  }),

  http.post(`${SUPABASE_URL}/auth/v1/signup`, async ({ request }) => {
    const body = (await request.json()) as { email?: string };

    if (body.email === 'exists@example.com') {
      return HttpResponse.json({ error: 'user_already_exists' }, { status: 422 });
    }

    return HttpResponse.json({
      access_token: mockSession.access_token,
      refresh_token: mockSession.refresh_token,
      expires_in: mockSession.expires_in,
      token_type: mockSession.token_type,
      user: mockSession.user,
    });
  }),

  http.post(`${SUPABASE_URL}/auth/v1/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${SUPABASE_URL}/storage/v1/object/sign/place-images/*`, ({ request }) => {
    const url = new URL(request.url);
    const path = url.pathname.split('/place-images/')[1] ?? 'unknown';

    return HttpResponse.json({
      signedURL: `/object/sign/place-images/${path}?token=test`,
    });
  }),
];

export { TEST_USER_ID };
