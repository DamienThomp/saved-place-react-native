type PlacePointProperties = { title: string };

export function placePoint(
  longitude: number,
  latitude: number,
  properties: PlacePointProperties,
) {
  return {
    type: 'Feature' as const,
    properties,
    geometry: {
      type: 'Point' as const,
      coordinates: [longitude, latitude] as [number, number],
    },
  };
}

export function featureCollection<T extends { type: 'Feature' }>(features: T[]) {
  return {
    type: 'FeatureCollection' as const,
    features,
  };
}