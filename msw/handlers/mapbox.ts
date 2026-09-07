import { http, HttpResponse } from 'msw';

export const mapboxHandlers = [
  http.get('https://api.mapbox.com/search/geocode/v6/reverse', ({ request }) => {
    const url = new URL(request.url);

    if (url.searchParams.get('simulate_error') === '1') {
      return new HttpResponse(null, { status: 500 });
    }

    if (url.searchParams.get('simulate_empty') === '1') {
      return HttpResponse.json({ features: [] });
    }

    return HttpResponse.json({
      features: [
        {
          properties: {
            full_address: '123 Main St, New York, NY 10001',
          },
        },
      ],
    });
  }),

  http.get('https://api.mapbox.com/directions/v5/mapbox/:mode/:coords', ({ params, request }) => {
    const url = new URL(request.url);

    if (url.searchParams.get('simulate_error') === '1') {
      return new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json({
      code: 'Ok',
      uuid: 'test-uuid',
      routes: [
        {
          distance: 1500,
          duration: 300,
          geometry: { coordinates: [[-74.0, 40.7], [-73.9, 40.8]], type: 'LineString' },
          legs: [],
          weight: 300,
          weight_name: 'auto',
        },
      ],
      waypoints: [],
    });
  }),
];
