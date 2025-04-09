import { useState, useEffect } from 'react';

export function useEditImagePreview(imageUri: string) {
  const [editImagePreview, setEditImagePreview] = useState<string | undefined>();

  useEffect(() => {
    if (imageUri.startsWith('file://')) {
      setEditImagePreview(undefined);
      return;
    }
    setEditImagePreview(imageUri);
  }, [imageUri]);

  return editImagePreview;
}
