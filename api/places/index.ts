import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { dbClient } from '~/lib/db';
import { useAuthentication } from '~/providers/AuthProvider';
import { InsertPlace } from '~/types/types';
import imageLoader from '~/utils/imageLoader';

export const usePlacesList = () => {
  const { session } = useAuthentication();
  const id = session?.user.id;

  return useQuery({
    queryKey: ['places', { userId: id }],
    queryFn: async () => {
      if (!id) {
        return null;
      }

      const { data, error } = await dbClient
        .from('places')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
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
      const { data, error } = await dbClient
        .from('places')
        .select('*')
        .eq('user_id', id)
        .ilike('title', `%${query}%`);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const usePlaceDetails = (id: number) => {
  return useQuery({
    queryKey: ['places', id],
    queryFn: async () => {
      const { data, error } = await dbClient.from('places').select('*').eq('id', id).single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const useInsertPlace = () => {
  const queryClient = useQueryClient();
  const { session } = useAuthentication();
  const user_id = session?.user.id;

  return useMutation({
    async mutationFn(data: Omit<InsertPlace, 'id' | 'created_at' | 'user_id'>) {
      if (!user_id) return;
      const { error, data: newPlace } = await dbClient
        .from('places')
        .insert({ ...data, user_id })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return newPlace;
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
      const { error } = await dbClient.from('places').delete().eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
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
      const { data, error } = await dbClient.storage.from('place-images').download(path);

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        const result = await imageLoader(data);

        return result;
      }

      return null;
    },
  });
};

export const useDeletImage = () => {
  return useMutation({
    async mutationFn(path: string) {
      const { error } = await dbClient.storage.from('place-images').remove([path]);

      if (error) {
        throw new Error(error.message);
      }
    },
  });
};
