import { PlaceForm } from '~/app/(other)/form';
import { CreatePayload, Place, UpdatePayload } from '~/types/types';

export const createPlacePayload = (
  formData: PlaceForm,
  imagePath: string,
  existingPlace?: Place | null
): CreatePayload | UpdatePayload => {
  const { title, longitude, latitude, address } = formData;

  const basePayload = { title, longitude, latitude, address, image: imagePath } as CreatePayload;

  return existingPlace ? { ...basePayload, id: existingPlace.id } : basePayload;
};
