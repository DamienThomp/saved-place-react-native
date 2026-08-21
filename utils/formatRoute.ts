export function formatRouteDuration(seconds?: number) {
  if (seconds == null) return '';

  const mins = Math.round(seconds / 60);
  return `${mins} min`;
}

export function formatRouteDistance(meters?: number) {
  if (meters == null) return '';

  return `${(meters / 1000).toFixed(1)} km`;
}
