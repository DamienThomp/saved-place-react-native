import { useCallback, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';

import { usePlacesList, useSearchPlace } from '~/api/places';

export default function useFilteredPlaces(query: string) {
  const {
    data,
    error,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = usePlacesList();

  const { data: searchResults, error: searchError } = useSearchPlace(query);

  const isSearching = query.length > 0;

  const paginatedList = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? null,
    [data]
  );

  const filteredList = isSearching ? (searchResults ?? null) : paginatedList;

  const loadMore = useCallback(() => {
    if (!isSearching && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isSearching, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (searchError) {
      Alert.alert('Something Went Wrong!', searchError.message);
    }
  }, [searchError]);

  return {
    filteredList,
    error,
    isLoading,
    isRefreshing: isRefetching && !isFetchingNextPage,
    isFetchingNextPage,
    hasNextPage: !isSearching && !!hasNextPage,
    loadMore,
    refetch,
    emptyMessage: isSearching ? `No results for "${query}"` : 'No Places Added.',
  };
}
