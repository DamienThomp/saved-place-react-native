import LoadingState from '~/components/common/LoadingState';
import PlacesList from '~/components/place/list/PlacesList';

import { usePlacesViewModel } from './usePlacesViewModel';

export default function MainView() {
  const { status, state, actions } = usePlacesViewModel();
  const { isLoading, error } = status;

  return (
    <LoadingState isLoading={isLoading} error={error}>
      <PlacesList
        items={state.filteredList}
        onRefresh={actions.refetch}
        isLoadingInitial={isLoading}
        isRefreshing={state.isRefreshing}
        isFetchingNextPage={state.isFetchingNextPage}
        onEndReached={actions.loadMore}
        emptyMessage={state.emptyMessage}
      />
    </LoadingState>
  );
}
