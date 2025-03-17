import { SearchBoxFeatureSuggestion, SearchBoxSuggestion } from '@mapbox/search-js-core';
import { SearchBoxSuggestionResponse } from '@mapbox/search-js-core/dist/searchbox/SearchBoxCore';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useSearchSuggestion, useRetrieveSearchResult } from '~/api/search';
import { Coordinates } from '~/types/types';

type MapSearchContextType = {
  searchResults?: SearchBoxSuggestionResponse | null | undefined;
  coordinates?: Coordinates | null | undefined;
  setSelectedResult?: Dispatch<SetStateAction<SearchBoxSuggestion | undefined>>;
  setSearchQuery?: Dispatch<SetStateAction<string | undefined>>;
  setSearchResults?: Dispatch<SetStateAction<SearchBoxSuggestionResponse | null | undefined>>;
  resetAll?: () => void;
};

const MapSearchContext = createContext<MapSearchContextType>({});

export default function MapSearchProvider({ children }: PropsWithChildren) {
  const [searchQuery, setSearchQuery] = useState<string | undefined>('');
  const [searchResults, setSearchResults] = useState<
    SearchBoxSuggestionResponse | null | undefined
  >(null);
  const [selectedResult, setSelectedResult] = useState<SearchBoxSuggestion>();
  const [coordinates, setCoordinates] = useState<Coordinates | null>();

  const { data: results } = useSearchSuggestion(searchQuery);
  const { data: features } = useRetrieveSearchResult(selectedResult?.mapbox_id, searchResults);

  const getCoordinates = (features: SearchBoxFeatureSuggestion[]) => {
    const [longitude, latitude] = features[0].geometry.coordinates;
    return { longitude, latitude };
  };

  const resetAll = () => {
    setSearchResults(null);
    setCoordinates(null);
    setSearchQuery('');
    setSelectedResult(undefined);
  };

  useEffect(() => {
    if (results?.suggestions) {
      setSearchResults(results);
    }
  }, [results]);

  useEffect(() => {
    if (features) {
      const coordinates = getCoordinates(features);
      setCoordinates(coordinates);
    }
  }, [features]);

  return (
    <MapSearchContext.Provider
      value={{
        setSearchResults,
        setSelectedResult,
        setSearchQuery,
        resetAll,
        searchResults,
        coordinates,
      }}>
      {children}
    </MapSearchContext.Provider>
  );
}

export const useMapSearch = () => useContext(MapSearchContext);
