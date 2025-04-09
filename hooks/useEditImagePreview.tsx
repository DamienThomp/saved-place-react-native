import { useMemo } from 'react';

export function useEditImagePreview(imageUri: string): string | undefined {
  return useMemo(() => {
    if (imageUri.startsWith('file://')) {
      return undefined;
    }

    return imageUri || undefined;
  }, [imageUri]);
}
