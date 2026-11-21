import type { ColorValue, OpaqueColorValue } from 'react-native';

/** Ionicons accepts string | OpaqueColorValue, not null or numeric ColorValue. */
export function iconColor(
  color: ColorValue | undefined,
): string | OpaqueColorValue | undefined {
  if (color == null || typeof color === 'number') {
    return undefined;
  }
  return color;
}