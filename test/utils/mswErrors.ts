import { http, HttpResponse } from 'msw';

const SUPABASE_URL = 'https://test.supabase.co';

export function supabasePlacesGetError(status = 500, message = 'Server error') {
  return http.get(`${SUPABASE_URL}/rest/v1/places`, () =>
    HttpResponse.json({ message }, { status })
  );
}

export function supabasePlacesPostError(status = 500, message = 'Server error') {
  return http.post(`${SUPABASE_URL}/rest/v1/places`, () =>
    HttpResponse.json({ message }, { status })
  );
}

export function supabasePlacesDeleteError(status = 500, message = 'Server error') {
  return http.delete(`${SUPABASE_URL}/rest/v1/places`, () =>
    HttpResponse.json({ message }, { status })
  );
}

export function supabaseStorageSignError(status = 500, message = 'Server error') {
  return http.post(`${SUPABASE_URL}/storage/v1/object/sign/place-images/*`, () =>
    HttpResponse.json({ message }, { status })
  );
}
