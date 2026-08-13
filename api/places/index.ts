import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createPlace,
  deleteImage,
  deletePlace,
  getAllPlaces,
  getPlace,
  getPlaces,
  insertImage,
  PLACES_PAGE_SIZE,
  searchPlaces,
  updatePlace,
} from '~/lib/db';
import { useAuthentication } from '~/providers/AuthProvider';
import { CreatePayload, UpdatePayload } from '~/types/types';

export const usePlacesList = () => {
  const { session } = useAuthentication();
  const id = session?.user.id;

  return useInfiniteQuery({
    queryKey: ['places', 'list', { userId: id }],
    queryFn: async ({ pageParam }) => {
      if (!id) return { data: [], hasMore: false };

      return await getPlaces(id, { page: pageParam, pageSize: PLACES_PAGE_SIZE });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
    enabled: !!id,
  });
};

export const useAllPlaces = () => {
  const { session } = useAuthentication();
  const id = session?.user.id;

  return useQuery({
    queryKey: ['places', 'all', { userId: id }],
    queryFn: async () => {
      if (!id) return null;

      return await getAllPlaces(id);
    },
    enabled: !!id,
    meta: { persist: true },
  });
};

export const useSearchPlace = (query: string) => {
  const { session } = useAuthentication();
  const id = session?.user.id;

  return useQuery({
    queryKey: ['places', 'search', query],
    queryFn: async () => {
      if (!query || !id) return null;

      return await searchPlaces(id, query);
    },
    enabled: !!query && !!id,
  });
};

export const usePlaceDetails = (id?: number) => {
  return useQuery({
    queryKey: ['places', 'detail', id],
    queryFn: async () => {
      if (!id) return null;

      return await getPlace(id);
    },
    meta: { persist: true },
    enabled: !!id,
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
