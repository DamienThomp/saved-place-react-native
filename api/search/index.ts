import { SearchBoxCore, SearchBoxSuggestionResponse, SessionToken } from '@mapbox/search-js-core';
import { useQuery } from '@tanstack/react-query';

const ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '';
const search = new SearchBoxCore({ accessToken: ACCESS_TOKEN });

let sessionToken: SessionToken;

export const useSearchSuggestion = (query?: string) => {
  return useQuery({
    queryKey: ['suggestions', query ?? null],
    queryFn: async () => {
      if (!query) return null;
      sessionToken = new SessionToken();
      const result = await search.suggest(query, {
        sessionToken,
        types: 'place, neighborhood, country',
      });
      return result;
    },
  });
};

export const useRetrieveSearchResult = (
  id?: string,
  results?: SearchBoxSuggestionResponse | null
) => {
  return useQuery({
    queryKey: ['result', id],
    queryFn: async () => {
      if (!id || !results) return null;
      const suggestion = results.suggestions.filter((result) => result.mapbox_id === id)[0];
      const { features } = await search.retrieve(suggestion, { sessionToken });
      return features;
    },
  });
};
