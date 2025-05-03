import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createPlace,
  deleteImage,
  deletePlace,
  getPlace,
  getPlaces,
  insertImage,
  searchPlaces,
  updatePlace,
} from '~/lib/db';
import { useAuthentication } from '~/providers/AuthProvider';
import { CreatePayload, UpdatePayload } from '~/types/types';

export const usePlacesList = () => {
  const { session } = useAuthentication();
  const id = session?.user.id;

  return useQuery({
    queryKey: ['places', { userId: id }],
    queryFn: async () => {
      if (!id) return null;

      return await getPlaces(id);
    },
  });
};

export const useSearchPlace = (query: string) => {
  const { session } = useAuthentication();
  const id = session?.user.id;

  return useQuery({
    queryKey: ['places', query],
    queryFn: async () => {
      if (!query || !id) return null;

      return await searchPlaces(id, query);
    },
  });
};

export const usePlaceDetails = (id?: number) => {
  return useQuery({
    queryKey: ['places', id],
    queryFn: async () => {
      if (!id) return null;

      return await getPlace(id);
    },
  });
};

export const useInsertPlace = () => {
  const queryClient = useQueryClient();
  const { session } = useAuthentication();
  const user_id = session?.user.id;

  return useMutation({
    async mutationFn(data: CreatePayload) {
      if (!user_id) return null;

      return await createPlace(data, user_id);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });
};

export const useUpdatePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: UpdatePayload) {
      const { id } = data;
      if (!id) return null;

      await updatePlace(data, id);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });
};

export const useDeletePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      await deletePlace(id);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['places'] });
    },
    async onError() {
      await queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });
};

export const useImage = (path?: string | null) => {
  return useQuery({
    queryKey: ['image', path || null],
    queryFn: async (): Promise<string | null> => {
      if (!path) return null;

      return await insertImage(path);
    },
  });
};

export const useDeletImage = () => {
  return useMutation({
    async mutationFn(path: string) {
      await deleteImage(path);
    },
  });
};
