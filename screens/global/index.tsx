import LoadingState from '~/components/common/LoadingState';
import Map from '~/components/map/Map';

import { useGlobalViewModel } from './useGlobalViewModel';

export default function GlobalView() {
  const { status, state } = useGlobalViewModel();

  return (
    <LoadingState isLoading={status.isLoading} error={status.error}>
      {state.isFocused && <Map readOnly showControls places={state.data} />}
    </LoadingState>
  );
}
