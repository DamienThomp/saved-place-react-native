import { renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';

import useFilteredPlaces from '~/hooks/useFilteredPlaces';
import { mockPlace, mockPlace2 } from '~/test/fixtures/places';

const mockFetchNextPage = vi.fn();
const mockRefetch = vi.fn();

const placesListState = {
  data: { pages: [{ data: [mockPlace, mockPlace2], hasMore: true }] },
  error: null,
  isLoading: false,
  isRefetching: false,
  isFetchingNextPage: false,
  hasNextPage: true,
  fetchNextPage: mockFetchNextPage,
  refetch: mockRefetch,
};

let searchError: Error | null = null;

vi.mock('~/api/places', () => ({
  usePlacesList: () => placesListState,
  useSearchPlace: (query: string) => ({
    data: query ? [mockPlace] : null,
    error: query ? searchError : null,
  }),
}));

describe('useFilteredPlaces', () => {
  beforeEach(() => {
    mockFetchNextPage.mockClear();
    mockRefetch.mockClear();
    searchError = null;
    vi.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns paginated list when not searching', async () => {
    const { result } = await renderHook(() => useFilteredPlaces(''));

    expect(result.current.filteredList).toEqual([mockPlace, mockPlace2]);
    expect(result.current.emptyMessage).toBe('No Places Added.');
    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns search results when query is provided', async () => {
    const { result } = await renderHook(() => useFilteredPlaces('Cafe'));

    expect(result.current.filteredList).toEqual([mockPlace]);
    expect(result.current.emptyMessage).toBe('No results for "Cafe"');
    expect(result.current.hasNextPage).toBe(false);
  });

  it('loads more when not searching and next page exists', async () => {
    const { result } = await renderHook(() => useFilteredPlaces(''));

    result.current.loadMore();

    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  it('does not load more while searching', async () => {
    const { result } = await renderHook(() => useFilteredPlaces('Cafe'));

    result.current.loadMore();

    expect(mockFetchNextPage).not.toHaveBeenCalled();
  });

  it('shows an alert when search fails', async () => {
    searchError = new Error('Search failed');

    await renderHook(() => useFilteredPlaces('Cafe'));

    expect(Alert.alert).toHaveBeenCalledWith('Something Went Wrong!', 'Search failed');
  });
});
